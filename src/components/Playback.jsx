import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

// absolutely horrible, thanks chatGPT

function Playback({ note, partials, centDeviation }) {
  const [isMuted, setIsMuted] = useState(true);
  const synthRefs = useRef([]); // {osc, gain}

  // Helper: convert note+partial+centDeviation to frequency
  const getFreq = (p) =>
    Tone.Frequency(note).toFrequency() * p * Math.pow(2, centDeviation / 1200);

  // Initialize oscillators on first render or when partial count changes
  useEffect(() => {
    if (!note || partials.length === 0) return;

    // Dispose old synths if partial count changed
    if (synthRefs.current.length !== partials.length) {
      synthRefs.current.forEach(({ osc, gain }) => {
        osc.stop();
        osc.dispose();
        gain.dispose();
      });
      synthRefs.current = [];
    }

    // Create missing oscillators
    for (let i = synthRefs.current.length; i < partials.length; i++) {
      const freq = getFreq(partials[i]);
      const gain = new Tone.Gain(isMuted ? 0 : 0.05).toDestination(); // small volume
      const osc = new Tone.Oscillator(freq, "sine").connect(gain);
      osc.start();
      synthRefs.current.push({ osc, gain });
    }

    // Update frequencies and fade in/out
    synthRefs.current.forEach(({ osc, gain }, idx) => {
      const freq = getFreq(partials[idx] || 1);
      osc.frequency.rampTo(freq, 0.1); // smooth freq change
      gain.gain.rampTo(isMuted ? 0 : 0.05, 0.2); // fade in/out
    });

    return () => {
      // Cleanup on unmount
      synthRefs.current.forEach(({ osc, gain }) => {
        osc.stop();
        osc.dispose();
        gain.dispose();
      });
      synthRefs.current = [];
    };
  }, [note, partials, centDeviation, isMuted]);

  const handleToggleMute = async () => {
    await Tone.start();
    setIsMuted((prev) => !prev);
  };

  return (
    <div style={{ marginTop: "15px" }}>
      <button
        onClick={handleToggleMute}
        style={{
          padding: "6px 12px",
          fontSize: "14px",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
}

export default Playback;
