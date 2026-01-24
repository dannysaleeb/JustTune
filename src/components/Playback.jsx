import { useEffect, useRef, useState, useMemo } from "react";
import * as Tone from "tone";

// Force high-priority routing for speakers
if (Tone.context.latencyHint !== "playback") {
  Tone.setContext(new Tone.Context({ latencyHint: "playback" }));
}

// --- Import samples ---
import A0 from "../assets/audio/A0.mp3";
import C1 from "../assets/audio/C1.mp3";
import Ds1 from "../assets/audio/Ds1.mp3";
import Fs1 from "../assets/audio/Fs1.mp3";
import A1 from "../assets/audio/A1.mp3";
import C2 from "../assets/audio/C2.mp3";
import Ds2 from "../assets/audio/Ds2.mp3";
import Fs2 from "../assets/audio/Fs2.mp3";
import A2 from "../assets/audio/A2.mp3";
import C3 from "../assets/audio/C3.mp3";
import Ds3 from "../assets/audio/Ds3.mp3";
import Fs3 from "../assets/audio/Fs3.mp3";
import A3 from "../assets/audio/A3.mp3";
import C4 from "../assets/audio/C4.mp3";
import Ds4 from "../assets/audio/Ds4.mp3";
import Fs4 from "../assets/audio/Fs4.mp3";
import A4 from "../assets/audio/A4.mp3";
import C5 from "../assets/audio/C5.mp3";
import Ds5 from "../assets/audio/Ds5.mp3";
import Fs5 from "../assets/audio/Fs5.mp3";
import A5 from "../assets/audio/A5.mp3";
import C6 from "../assets/audio/C6.mp3";
import Ds6 from "../assets/audio/Ds6.mp3";
import Fs6 from "../assets/audio/Fs6.mp3";
import A6 from "../assets/audio/A6.mp3";
import C7 from "../assets/audio/C7.mp3";
import Ds7 from "../assets/audio/Ds7.mp3";
import Fs7 from "../assets/audio/Fs7.mp3";
import C8 from "../assets/audio/C8.mp3";

const SAMPLE_MAP = {
  A0, C1, Ds1, Fs1, A1, C2, Ds2, Fs2,
  A2, C3, Ds3, Fs3, A3, C4, Ds4, Fs4,
  A4, C5, Ds5, Fs5, A5, C6, Ds6, Fs6,
  A6, C7, Ds7, Fs7, C8
};

const NOTE_LIST = Object.keys(SAMPLE_MAP);

// ⭐ THE FIX: Start loading GLOBALLY as soon as the file is imported.
// This happens while the user is still looking at the StartOverlay.
const globalBuffers = new Tone.Buffers(SAMPLE_MAP);

export default function Playback({ partials = [], settings, playTrigger }) {
  const [isLoaded, setIsLoaded] = useState(globalBuffers.loaded);
  const sampleFreqMap = useRef({});
  const activeSources = useRef([]);
  const masterGain = useRef(null);
  const FADE_TIME = 0.1;

  // --- 1. Monitor the global loading state ---
  useEffect(() => {
    if (globalBuffers.loaded) {
      setIsLoaded(true);
    } else {
      const check = setInterval(() => {
        if (globalBuffers.loaded) {
          setIsLoaded(true);
          clearInterval(check);
        }
      }, 100);
      return () => clearInterval(check);
    }
  }, []);

  // --- 2. Initialize Frequency Map ---
  useEffect(() => {
    NOTE_LIST.forEach(note => {
      sampleFreqMap.current[note] = Tone.Frequency(note.replace("s", "#")).toFrequency();
    });
  }, []);

  // --- 3. Audio Handshake & Connection ---
  useEffect(() => {
    const initAudio = async () => {
      if (Tone.context.state !== "running") {
        await Tone.start();
      }
      Tone.Destination.mute = false;
      Tone.Destination.volume.value = 0;
      masterGain.current = new Tone.Gain(1).toDestination();
    };

    initAudio();

    return () => {
      masterGain.current?.dispose();
    };
  }, []);

  // --- 4. Logic & Calculations ---
  const tuningRatio = useMemo(() => {
    return Math.pow(2, (settings.centDeviation ?? 0) / 1200);
  }, [settings.centDeviation]);

  const releaseOldSources = (sources) => {
    if (!sources.length) return;
    const now = Tone.now();
    const disposeDelay = (FADE_TIME + 0.1) * 1000;

    sources.forEach(({ source, gain }) => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.rampTo(0, FADE_TIME);
      source.stop(now + FADE_TIME + 0.05);

      setTimeout(() => {
        source.dispose();
        gain.dispose();
      }, disposeDelay);
    });
  };

  const createSources = (type) => {
    // We now check our state linked to globalBuffers
    if (!partials.length || !isLoaded || !masterGain.current) return;

    const targets = partials
      .slice(0, settings.maxPartials)
      .map(p => {
        let freq = settings.use12EDO
          ? p.nearest12edoFrequency() * (p.fundamental.frequency / p.fundamental.originalFrequency)
          : p.frequency;
        return freq * tuningRatio;
      });

    targets.forEach(freq => {
      let source;
      const gain = new Tone.Gain(0).connect(masterGain.current);
      const now = Tone.now();

      if (type === "piano") {
        const bestKey = NOTE_LIST.reduce((best, key) => {
          const diff = Math.abs(1200 * Math.log2(freq / sampleFreqMap.current[key]));
          return diff < best.diff ? { key, diff } : best;
        }, { key: null, diff: Infinity }).key;

        if (!bestKey) return;

        // Use globalBuffers directly
        source = new Tone.BufferSource(globalBuffers.get(bestKey)).connect(gain);
        source.playbackRate.value = freq / sampleFreqMap.current[bestKey];
        gain.gain.rampTo(0.3, 0.02);
      } else {
        source = new Tone.Oscillator(freq, type).connect(gain);
        gain.gain.rampTo(0.04, FADE_TIME);
      }

      source.start(now);
      activeSources.current.push({ source, gain });
    });
  };

  const updateSound = () => {
    const old = [...activeSources.current];
    activeSources.current = [];
    releaseOldSources(old);
    createSources(settings.playbackMode);
  };

  // --- 5. Effects ---
  useEffect(() => {
    if (settings.mute) {
      const old = [...activeSources.current];
      activeSources.current = [];
      releaseOldSources(old);
    }
  }, [settings.mute]);

  const playbackSignature = useMemo(() => {
    const freqs = partials
      .slice(0, settings.maxPartials)
      .map(p => p.frequency.toFixed(2))
      .join("_");

    return `${settings.playbackMode}|${settings.use12EDO}|${settings.centDeviation}|${freqs}|${playTrigger}`;
  }, [
    settings.playbackMode,
    settings.use12EDO,
    settings.centDeviation,
    settings.maxPartials,
    partials,
    playTrigger
  ]);

  useEffect(() => {
    if (!settings.mute) updateSound();
  }, [playbackSignature, settings.mute, isLoaded]); // Added isLoaded to trigger sound if it finishes loading while active

  return null;
}