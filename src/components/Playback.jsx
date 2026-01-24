import { useEffect, useRef, useState, useMemo } from "react";
import * as Tone from "tone";

// --- Import samples ---
import A0 from "../assets/audio/A0.mp3"; import C1 from "../assets/audio/C1.mp3"; import Ds1 from "../assets/audio/Ds1.mp3"; import Fs1 from "../assets/audio/Fs1.mp3"; import A1 from "../assets/audio/A1.mp3"; import C2 from "../assets/audio/C2.mp3"; import Ds2 from "../assets/audio/Ds2.mp3"; import Fs2 from "../assets/audio/Fs2.mp3"; import A2 from "../assets/audio/A2.mp3"; import C3 from "../assets/audio/C3.mp3"; import Ds3 from "../assets/audio/Ds3.mp3"; import Fs3 from "../assets/audio/Fs3.mp3"; import A3 from "../assets/audio/A3.mp3"; import C4 from "../assets/audio/C4.mp3"; import Ds4 from "../assets/audio/Ds4.mp3"; import Fs4 from "../assets/audio/Fs4.mp3"; import A4 from "../assets/audio/A4.mp3"; import C5 from "../assets/audio/C5.mp3"; import Ds5 from "../assets/audio/Ds5.mp3"; import Fs5 from "../assets/audio/Fs5.mp3"; import A5 from "../assets/audio/A5.mp3"; import C6 from "../assets/audio/C6.mp3"; import Ds6 from "../assets/audio/Ds6.mp3"; import Fs6 from "../assets/audio/Fs6.mp3"; import A6 from "../assets/audio/A6.mp3"; import C7 from "../assets/audio/C7.mp3"; import Ds7 from "../assets/audio/Ds7.mp3"; import Fs7 from "../assets/audio/Fs7.mp3"; import C8 from "../assets/audio/C8.mp3";

const NOTE_LIST = [ "A0", "C1", "Ds1", "Fs1", "A1", "C2", "Ds2", "Fs2", "A2", "C3", "Ds3", "Fs3", "A3", "C4", "Ds4", "Fs4", "A4", "C5", "Ds5", "Fs5", "A5", "C6", "Ds6", "Fs6", "A6", "C7", "Ds7", "Fs7", "C8" ];
const SAMPLE_MAP = { A0, C1, Ds1, Fs1, A1, C2, Ds2, Fs2, A2, C3, Ds3, Fs3, A3, C4, Ds4, Fs4, A4, C5, Ds5, Fs5, A5, C6, Ds6, Fs6, A6, C7, Ds7, Fs7, C8 };

export default function Playback({ partials = [], settings, playTrigger }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const buffers = useRef(null);
  const sampleFreqMap = useRef({});
  const activeSources = useRef([]); 
  const FADE_TIME = 0.1; 

  // --- Compute effective tuning ratio using centDeviation ---
  const tuningRatio = useMemo(() => {
    return Math.pow(2, (settings.centDeviation ?? 0) / 1200);
  }, [settings.centDeviation]);

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
    
    // Apply tuningRatio to every target frequency
	const targets = partials.slice(0, settings.maxPartials).map((p) => {
	  let freq;
	  // Use the correct property name from your state
	  if (settings.use12EDO) { 
		const ratio = p.fundamental.frequency / p.fundamental.originalFrequency;
		freq = p.nearest12edoFrequency() * ratio;
	  } else {
		freq = p.frequency;
	  }
	  return freq * tuningRatio;
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
    createSources(settings.playbackMode);
  };

  // --- EFFECT: Handle On/Off Logic ---
  useEffect(() => {
    if (settings.mute) {
      const oldSources = [...activeSources.current];
      activeSources.current = [];
      releaseOldSources(oldSources);
    }
  }, [settings.mute]);

  // --- EFFECT: Live Updates ---
  const playbackSignature = useMemo(() => {
    const freqs = partials.slice(0, settings.maxPartials).map(p => p.frequency.toFixed(2)).join("_");
    return `${settings.playbackMode}|${settings.use12EDO}|${settings.tuningFrequency}|${settings.centDeviation}|${freqs}|${playTrigger}`;
  }, [settings.playbackMode, settings.use12EDO, settings.tuningFrequency, settings.centDeviation, settings.maxPartials, partials, playTrigger]);

  useEffect(() => {
    if (!settings.mute) {
      updateSound();
    }
  }, [playbackSignature, settings.mute]);

  return null; // Headless component
}
