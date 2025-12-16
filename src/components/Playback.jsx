import { useEffect, useRef, useState, useMemo } from "react";
import * as Tone from "tone";

// --- Import samples ---
import A0 from "../Audio/A0.mp3"; import C1 from "../Audio/C1.mp3"; import Ds1 from "../Audio/Ds1.mp3"; import Fs1 from "../Audio/Fs1.mp3"; import A1 from "../Audio/A1.mp3"; import C2 from "../Audio/C2.mp3"; import Ds2 from "../Audio/Ds2.mp3"; import Fs2 from "../Audio/Fs2.mp3"; import A2 from "../Audio/A2.mp3"; import C3 from "../Audio/C3.mp3"; import Ds3 from "../Audio/Ds3.mp3"; import Fs3 from "../Audio/Fs3.mp3"; import A3 from "../Audio/A3.mp3"; import C4 from "../Audio/C4.mp3"; import Ds4 from "../Audio/Ds4.mp3"; import Fs4 from "../Audio/Fs4.mp3"; import A4 from "../Audio/A4.mp3"; import C5 from "../Audio/C5.mp3"; import Ds5 from "../Audio/Ds5.mp3"; import Fs5 from "../Audio/Fs5.mp3"; import A5 from "../Audio/A5.mp3"; import C6 from "../Audio/C6.mp3"; import Ds6 from "../Audio/Ds6.mp3"; import Fs6 from "../Audio/Fs6.mp3"; import A6 from "../Audio/A6.mp3"; import C7 from "../Audio/C7.mp3"; import Ds7 from "../Audio/Ds7.mp3"; import Fs7 from "../Audio/Fs7.mp3"; import C8 from "../Audio/C8.mp3";

const NOTE_LIST = [ "A0", "C1", "Ds1", "Fs1", "A1", "C2", "Ds2", "Fs2", "A2", "C3", "Ds3", "Fs3", "A3", "C4", "Ds4", "Fs4", "A4", "C5", "Ds5", "Fs5", "A5", "C6", "Ds6", "Fs6", "A6", "C7", "Ds7", "Fs7", "C8" ];
const SAMPLE_MAP = { A0, C1, Ds1, Fs1, A1, C2, Ds2, Fs2, A2, C3, Ds3, Fs3, A3, C4, Ds4, Fs4, A4, C5, Ds5, Fs5, A5, C6, Ds6, Fs6, A6, C7, Ds7, Fs7, C8 };

export default function Playback({ partials = [], settings, playTrigger, isPlaying, mode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const buffers = useRef(null);
  const sampleFreqMap = useRef({});
  const activeSources = useRef([]); 
  const FADE_TIME = 0.1; 

  // --- Load Samples ---
  useEffect(() => {
    const urls = {};
    NOTE_LIST.forEach((note) => {
      urls[note] = SAMPLE_MAP[note];
      const tf = note.replace("s", "#");
      sampleFreqMap.current[note] = Tone.Frequency(tf).toFrequency();
    });
    buffers.current = new Tone.Buffers(urls, () => setIsLoaded(true));
    return () => { if (buffers.current) buffers.current.dispose(); };
  }, []);

  // --- HELPER: Fire-and-forget cleanup ---
  const releaseOldSources = (sourcesToRelease) => {
    if (sourcesToRelease.length === 0) return;

    const now = Tone.now();
    const disposeDelay = (FADE_TIME + 0.1) * 1000; 

    sourcesToRelease.forEach(({ source, gain }) => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.rampTo(0, FADE_TIME);
      source.stop(now + FADE_TIME + 0.05);

      setTimeout(() => {
        try {
          source.dispose();
          gain.dispose();
        } catch(e) { /* ignore cleanup errors */ }
      }, disposeDelay);
    });
  };

  // --- Playback Generators ---
  const createSources = (type) => {
    if (!partials.length) return;
    
    const targets = partials.slice(0, settings.maxPartials).map((p) => {
      if (settings.use12EDO) {
        const ratio = p.fundamental.frequency / p.fundamental.originalFrequency;
        return p.nearest12edoFrequency() * ratio;
      }
      return p.frequency;
    });

    targets.forEach((freq) => {
      let source, gain;
      const now = Tone.now();

      if (type === "piano") {
        if (!buffers.current) return;
        const bestKey = NOTE_LIST.reduce((best, key) => {
          const sampleFreq = sampleFreqMap.current[key];
          const centsDiff = Math.abs(1200 * Math.log2(freq / sampleFreq));
          return centsDiff < best.diff ? { key, diff: centsDiff } : best;
        }, { key: null, diff: Infinity }).key;
        
        if (!bestKey) return;
        const buffer = buffers.current.get(bestKey);
        
        gain = new Tone.Gain(0).toDestination();
        source = new Tone.BufferSource(buffer).connect(gain);
        source.playbackRate.value = freq / sampleFreqMap.current[bestKey];
        gain.gain.rampTo(0.3, 0.02);
      } else {
        gain = new Tone.Gain(0).toDestination();
        source = new Tone.Oscillator(freq, type).connect(gain);
        gain.gain.rampTo(0.04, FADE_TIME);
      }

      source.start(now);
      activeSources.current.push({ source, gain });
    });
  };

  const updateSound = () => {
    const oldSources = [...activeSources.current];
    activeSources.current = [];
    releaseOldSources(oldSources);
    createSources(mode);
  };

  // --- EFFECT: Handle On/Off Logic ---
  // When isPlaying becomes false, kill sound.
  useEffect(() => {
    if (!isPlaying) {
      const oldSources = [...activeSources.current];
      activeSources.current = [];
      releaseOldSources(oldSources);
    }
    // Note: We do NOT auto-start here. Start is handled by playbackSignature change or manual triggers
    // However, if we switch modes while playing, playbackSignature handles it.
  }, [isPlaying]);

  // --- EFFECT: Live Updates ---
  // Calculates a signature. If signature changes AND we are playing, update sound.
  const playbackSignature = useMemo(() => {
    const freqs = partials.slice(0, settings.maxPartials).map(p => p.frequency.toFixed(2)).join("_");
    return `${mode}|${settings.use12EDO}|${freqs}|${playTrigger}`;
  }, [mode, settings.use12EDO, settings.maxPartials, partials, playTrigger]);

  useEffect(() => {
    if (isPlaying) {
      updateSound();
    }
  }, [playbackSignature, isPlaying]); // Added isPlaying dependency so it triggers on start

  return null; // Headless component
}