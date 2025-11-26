import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

const Playback = ({ partials = [] }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [use12EDO, setUse12EDO] = useState(false); // JI vs 12-EDO toggle update from freq control (to keep all that consistent)

  const synth = useRef(null);
  const activeFrequencies = useRef(new Set());

  const PRESETS = [
    {
      name: "Sine",
      volume: -20,
      options: {
        oscillator: { type: "sine" },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 1.0 },
      },
    },
    {
      name: "Pluck",
      volume: -15,
      options: {
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.05,
          attackCurve: "exponential",
          decay: 4.0,
          decayCurve: "exponential",
          sustain: 0.07,
          release: 1.0,
        },
      },
    },
    {
      name: "Triangle",
      volume: -20,
      options: {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.1, decay: 0.2, sustain: 1.0, release: 1.0 },
      },
    },
  ];

  // Initialize synth
  useEffect(() => {
    const initialPreset = PRESETS[0];

    synth.current = new Tone.PolySynth(Tone.Synth, {
      ...initialPreset.options,
      maxPolyphony: 32,
    }).toDestination();

    synth.current.volume.value = initialPreset.volume;

    return () => {
      if (synth.current) synth.current.dispose();
    };
  }, []);

  // map partials to playback frequencies with adjustment
  const mapFrequencies = () =>
    partials.map((p) => {
      if (use12EDO) {
        const ratio = p.fundamental.frequency / p.fundamental.originalFrequency;
        return p.nearest12edoFrequency() * ratio; // scale 12-EDO by fundamental adjustment HERE not in Partials class (?)
      } else {
        return p.frequency; // JI / partial frequency
      }
    });

  // Handle preset changes
  useEffect(() => {
    if (!synth.current) return;

    const selected = PRESETS[activePresetIndex];

    synth.current.releaseAll();
    activeFrequencies.current.clear();

    synth.current.set({
      oscillator: selected.options.oscillator,
      envelope: selected.options.envelope,
    });
    synth.current.volume.rampTo(selected.volume, 0.1);

    if (isPlaying && partials.length > 0) {
      const freqs = mapFrequencies();
      synth.current.triggerAttack(freqs);
      freqs.forEach((f) => activeFrequencies.current.add(f));
    }
  }, [activePresetIndex, use12EDO, partials]);

  // Fix stuttering and update frequencies
  useEffect(() => {
    if (!isPlaying || !synth.current) return;

    const targetFreqs = mapFrequencies();
    const targetSet = new Set(targetFreqs);

    // Remove notes that are no longer active
    activeFrequencies.current.forEach((freq) => {
      if (!targetSet.has(freq)) {
        synth.current.triggerRelease(freq);
        activeFrequencies.current.delete(freq);
      }
    });

    // Add new notes
    targetFreqs.forEach((freq) => {
      if (!activeFrequencies.current.has(freq)) {
        synth.current.triggerAttack(freq);
        activeFrequencies.current.add(freq);
      }
    });
  }, [partials, isPlaying, use12EDO]);

  // Toggle play/stop
  const togglePlay = async () => {
    await Tone.start();

    if (isPlaying) {
      synth.current.releaseAll();
      activeFrequencies.current.clear();
      setIsPlaying(false);
    } else {
      const freqs = mapFrequencies();
      if (freqs.length > 0) {
        synth.current.triggerAttack(freqs);
        freqs.forEach((f) => activeFrequencies.current.add(f));
      }
      setIsPlaying(true);
    }
  };

  const hasPartials = partials.length > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "15px",
      }}
    >
      {/* Preset buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        {PRESETS.map((preset, index) => {
          const isActive = activePresetIndex === index;
          return (
            <button
              key={preset.name}
              onClick={() => setActivePresetIndex(index)}
              style={{
                padding: "6px 12px",
                fontSize: "14px",
                cursor: "pointer",
                backgroundColor: isActive ? "#555" : "#eee",
                color: isActive ? "white" : "black",
                border: "1px solid #ccc",
                borderRadius: "4px",
                transition: "all 0.2s",
              }}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Play + JI/12-EDO toggle */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={togglePlay}
          disabled={!hasPartials}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: hasPartials ? "pointer" : "not-allowed",
            backgroundColor: isPlaying ? "#f44336" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            opacity: hasPartials ? 1 : 0.6,
            transition: "background-color 0.2s",
            minWidth: "150px",
          }}
        >
          {isPlaying ? "Stop" : "Play Partials"}
        </button>

        {/* JI / 12-EDO toggle */}
        <button
          onClick={() => setUse12EDO((prev) => !prev)}
          disabled={!hasPartials}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: hasPartials ? "pointer" : "not-allowed",
            backgroundColor: "#eee",
            color: "black",
            border: "1px solid #ccc",
            borderRadius: "4px",
            transition: "all 0.2s",
            minWidth: "120px",
            display: "flex",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <span style={{ fontWeight: use12EDO ? "normal" : "bold" }}>JI</span>
          <span>/</span>
          <span style={{ fontWeight: use12EDO ? "bold" : "normal" }}>12-EDO</span>
        </button>
      </div>
    </div>
  );
};

export default Playback;
