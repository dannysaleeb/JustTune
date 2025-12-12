import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { MdOutlinePiano } from "react-icons/md";
import { PiWaveSineLight } from "react-icons/pi";

// --- Static imports of piano samples ---
import A0 from "../Audio/A0.mp3";
import C1 from "../Audio/C1.mp3";
import Ds1 from "../Audio/Ds1.mp3";
import Fs1 from "../Audio/Fs1.mp3";
import A1 from "../Audio/A1.mp3";
import C2 from "../Audio/C2.mp3";
import Ds2 from "../Audio/Ds2.mp3";
import Fs2 from "../Audio/Fs2.mp3";
import A2 from "../Audio/A2.mp3";
import C3 from "../Audio/C3.mp3";
import Ds3 from "../Audio/Ds3.mp3";
import Fs3 from "../Audio/Fs3.mp3";
import A3 from "../Audio/A3.mp3";
import C4 from "../Audio/C4.mp3";
import Ds4 from "../Audio/Ds4.mp3";
import Fs4 from "../Audio/Fs4.mp3";
import A4 from "../Audio/A4.mp3";
import C5 from "../Audio/C5.mp3";
import Ds5 from "../Audio/Ds5.mp3";
import Fs5 from "../Audio/Fs5.mp3";
import A5 from "../Audio/A5.mp3";
import C6 from "../Audio/C6.mp3";
import Ds6 from "../Audio/Ds6.mp3";
import Fs6 from "../Audio/Fs6.mp3";
import A6 from "../Audio/A6.mp3";
import C7 from "../Audio/C7.mp3";
import Ds7 from "../Audio/Ds7.mp3";
import Fs7 from "../Audio/Fs7.mp3";
import C8 from "../Audio/C8.mp3";

const NOTE_LIST = [
  "A0", "C1", "Ds1", "Fs1",
  "A1", "C2", "Ds2", "Fs2",
  "A2", "C3", "Ds3", "Fs3",
  "A3", "C4", "Ds4", "Fs4",
  "A4", "C5", "Ds5", "Fs5",
  "A5", "C6", "Ds6", "Fs6",
  "A6", "C7", "Ds7", "Fs7",
  "C8"
];

const SAMPLE_MAP = {
  A0, C1, Ds1, Fs1, A1, C2, Ds2, Fs2, A2, C3, Ds3, Fs3,
  A3, C4, Ds4, Fs4, A4, C5, Ds5, Fs5, A5, C6, Ds6, Fs6,
  A6, C7, Ds7, Fs7, C8
};

export default function Playback({ partials = [], settings, setSettings }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState("piano"); // "piano" | "sine"
  const [isLoaded, setIsLoaded] = useState(false);

  const buffers = useRef(null);
  const sampleFreqMap = useRef({});
  const activeSources = useRef([]);

  const FADE_TIME = 0.12;

  const setUse12EDO = (value) => {
    setSettings(prev => ({
      ...prev,
      use12EDO: value,
    }));
  }

  // --- Load local piano samples ---
  useEffect(() => {
    const urls = {};
    NOTE_LIST.forEach((note) => {
      urls[note] = SAMPLE_MAP[note];
      const tf = note.replace("s", "#");
      sampleFreqMap.current[note] = Tone.Frequency(tf).toFrequency();
    });

    buffers.current = new Tone.Buffers(urls, () => {
      setIsLoaded(true);
    });

    return () => {
      if (buffers.current) buffers.current.dispose();
    };
  }, []);

  // --- Stop all playing sources ---
  const stopAllSmooth = async () => {
    const now = Tone.now();

    activeSources.current.forEach(({ source, gain }) => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.rampTo(0, FADE_TIME);
      source.stop(now + FADE_TIME + 0.02);
    });

    activeSources.current = [];

    return new Promise((res) =>
      setTimeout(res, (FADE_TIME + 0.05) * 1000)
    );
  };

  // --- Play piano with nearest sample, use playbackRate to retune -----------------------------------------
  const playPiano = () => {
    if (!buffers.current) return;

    const targets = partials.slice(0, settings.maxPartials).map((p) => {
      if (settings.use12EDO) {
        const ratio = p.fundamental.frequency / p.fundamental.originalFrequency;
        return p.nearest12edoFrequency() * ratio;
      }
      return p.frequency;
    });

    targets.forEach((freq) => {
      const bestKey = NOTE_LIST.reduce((best, key) => {
        const sampleFreq = sampleFreqMap.current[key];
        const centsDiff = Math.abs(1200 * Math.log2(freq / sampleFreq));
        return centsDiff < best.diff ? { key, diff: centsDiff } : best;
      }, { key: null, diff: Infinity }).key;

      if (!bestKey) return;

      const buffer = buffers.current.get(bestKey);
      if (!buffer) return;

      const baseFreq = sampleFreqMap.current[bestKey];

      const gain = new Tone.Gain(0).toDestination();
      gain.gain.rampTo(0.3, 0.01);

      const src = new Tone.BufferSource(buffer).connect(gain);
      src.playbackRate.value = freq / baseFreq;
      src.start();

      activeSources.current.push({ source: src, gain });
    });
  };

  // --- Play sine waves -------------------------------------------------------------
  const playSine = () => {
    const targets = partials.slice(0, settings.maxPartials).map((p) => {
      if (settings.use12EDO) {
        const ratio = p.fundamental.frequency / p.fundamental.originalFrequency;
        return p.nearest12edoFrequency() * ratio;
      }
      return p.frequency;
    });

    targets.forEach((freq) => {
      const osc = new Tone.Oscillator(freq, "sine");
      const gain = new Tone.Gain(0).toDestination();

      osc.connect(gain);
      gain.gain.rampTo(0.06, FADE_TIME);

      osc.start();

      activeSources.current.push({ source: osc, gain });
    });
  };

  const startCurrentMode = () => {
    if (!partials.length) return;

    if (mode === "piano") playPiano();
    else playSine();
  };

  const togglePlay = async () => {
    await Tone.start();

    if (isPlaying) {
      await stopAllSmooth();
      setIsPlaying(false);
      return;
    }

    await stopAllSmooth();
    startCurrentMode();
    setIsPlaying(true);
  };

  const handleModeClick = async (newMode) => {
    await Tone.start();

    if (mode !== newMode) {
      await stopAllSmooth();
      setMode(newMode);
    } else {
      await stopAllSmooth();
      startCurrentMode();
    }

    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      (async () => {
        await stopAllSmooth();
        startCurrentMode();
      })();
    }
  }, [partials, settings.use12EDO, mode]);

  const hasPartials = partials.length > 0;

  const getIconColor = (iconMode) => {
    const isActiveMode = mode === iconMode;
    if (!isPlaying) return "#ccc";
    return isActiveMode ? "#000" : "#888";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
      <button
        onClick={togglePlay}
        disabled={!hasPartials}
        style={{
          all: "unset",
          cursor: hasPartials ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent"
        }}
      >
        {isPlaying ? <HiMiniSpeakerWave size={28} /> : <HiMiniSpeakerXMark size={28} />}
      </button>

      <div style={{ display: "flex", flexDirection: "row", gap: "15px" }}>
	  
        <button
          onClick={() => hasPartials && handleModeClick("sine")}
          disabled={!hasPartials}
          style={{
            all: "unset",
            cursor: hasPartials ? "pointer" : "not-allowed",
            color: getIconColor("sine"),
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PiWaveSineLight size={28} />
        </button>	  
	  
        <button
          onClick={() => hasPartials && handleModeClick("piano")}
          disabled={!hasPartials}
          style={{
            all: "unset",
            cursor: hasPartials ? "pointer" : "not-allowed",
            color: getIconColor("piano"),
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MdOutlinePiano size={28} />
        </button>
      </div>

    {/* 12-EDO / JI Toggle */}
    <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", userSelect: "none" }}>
      <span
        onClick={() => hasPartials && setUse12EDO(false)}
        style={{
          cursor: hasPartials ? "pointer" : "not-allowed",
          color: !settings.use12EDO ? "#000" : "#888",
		  WebkitTapHighlightColor: "transparent",
        }}
      >
        JI
      </span>

      <span
        onClick={() => hasPartials && setUse12EDO(true)}
        style={{
          cursor: hasPartials ? "pointer" : "not-allowed",
          color: settings.use12EDO ? "#000" : "#888",
		  WebkitTapHighlightColor: "transparent",
        }}
      >
        12-EDO
      </span>
    </div>

    {/* Loading Indicator */}
    {!isLoaded && (
      <span style={{ fontSize: "12px", color: "#666" }}>
        Loading samples…
      </span>
    )}
  </div>
  );
}
