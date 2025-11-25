import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

function Playback({ 
  note, 
  partials = [], 
  centDeviation = 0 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [oscType, setOscType] = useState("sine");
  
  // NEW: Volume State (0 to 1)
  const [volume, setVolume] = useState(0.5);

  const voicesRef = useRef({}); 
  const masterGainRef = useRef(null);

  // LOWER GAIN per partial creates "Headroom" to prevent distortion
  // when stacking loud waves like Squares.
  const PARTIAL_GAIN = 0.05; 
  const FADE_TIME = 0.1;

  // 1. Initialize Master Gain
  useEffect(() => {
    masterGainRef.current = new Tone.Gain(0).toDestination();
    return () => masterGainRef.current?.dispose();
  }, []);

  // 2. NEW: Handle Volume Slider Changes
  useEffect(() => {
    if (masterGainRef.current) {
      // We ramp to the new volume to prevent zipper noise when sliding fast
      // If not playing, we keep it at 0 to ensure silence
      const targetVol = isPlaying ? volume : 0;
      masterGainRef.current.gain.rampTo(targetVol, 0.1);
    }
  }, [volume, isPlaying]);

  const getFreq = (p) => {
    if (!note) return 0;
    const base = Tone.Frequency(note).toFrequency();
    return base * p * Math.pow(2, centDeviation / 1200);
  };

  // 3. Main Audio Loop
  useEffect(() => {
    if (!note || !masterGainRef.current) return;

    const now = Tone.now();
    const activePartials = new Set(partials);

    // --- CLEANUP ---
    Object.keys(voicesRef.current).forEach((pKey) => {
      const pNum = Number(pKey);
      if (!activePartials.has(pNum)) {
        const voice = voicesRef.current[pNum];
        
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
        voice.gain.gain.linearRampToValueAtTime(0, now + FADE_TIME);
        
        voice.osc.stop(now + FADE_TIME + 0.1);
        voice.osc.onstop = () => {
          voice.osc.dispose();
          voice.gain.dispose();
        };
        delete voicesRef.current[pNum];
      }
    });

    // --- UPDATE / CREATE ---
    if (isPlaying) {
      partials.forEach((p) => {
        const targetFreq = getFreq(p);
        
        if (voicesRef.current[p]) {
          // Update existing
          const voice = voicesRef.current[p];
          voice.osc.frequency.rampTo(targetFreq, 0.1, now);
          if (voice.osc.type !== oscType) voice.osc.type = oscType;
        } else {
          // Create new
          const gainNode = new Tone.Gain(0).connect(masterGainRef.current);
          const osc = new Tone.Oscillator(targetFreq, oscType).connect(gainNode);
          
          osc.start(now);
          
          // Ramp to PARTIAL_GAIN (0.05) instead of Master Volume
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(PARTIAL_GAIN, now + FADE_TIME);

          voicesRef.current[p] = { osc, gain: gainNode };
        }
      });
    }
  }, [note, partials, centDeviation, isPlaying, oscType]); // Remove 'volume' from here, handled in separate effect

  const handleTogglePlay = async () => {
    await Tone.start();
    const now = Tone.now();
    
    if (isPlaying) {
      // Fade out
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.linearRampToValueAtTime(0, now + FADE_TIME);
      setIsPlaying(false);
    } else {
      // Fade in to current VOLUME setting
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.linearRampToValueAtTime(volume, now + FADE_TIME);
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ 
      marginTop: "10px", 
      display: "flex", 
      gap: "15px", 
      alignItems: "center",
      background: "#f5f5f5",
      padding: "10px",
      borderRadius: "8px"
    }}>
      <button 
        onClick={handleTogglePlay} 
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        {isPlaying ? "Stop" : "Play"}
      </button>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ fontSize: "10px", fontWeight: "bold" }}>Waveform</label>
        <select 
          value={oscType} 
          onChange={(e) => setOscType(e.target.value)}
          style={{ padding: "4px" }}
        >
          <option value="sine">Sine (Pure)</option>
          <option value="square">Square (Buzzy)</option>
          <option value="triangle">Triangle (Soft)</option>
          <option value="sawtooth">Sawtooth (Sharp)</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", width: "100px" }}>
        <label style={{ fontSize: "10px", fontWeight: "bold" }}>
          Volume: {Math.round(volume * 100)}%
        </label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}

export default Playback;