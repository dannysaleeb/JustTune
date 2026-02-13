// src/components/AudioGate.jsx
import { useRef } from "react";
import * as Tone from "tone";
import StartOverlay from "./StartOverlay";
import silentMP3 from "../../assets/audio/silence.mp3";

export default function AudioGate({ onReady }) {
  const started = useRef(false);
  const htmlAudioRef = useRef(null);
  const anchorRef = useRef(null);

  const startAudio = async () => {
    if (started.current) return;
    started.current = true;

    try {
      // 1. Unlock Tone / Web Audio (must be inside user gesture)
      await Tone.start();
      await Tone.context.resume();

      // Ensure destination is actually audible
      Tone.Destination.mute = false;
      Tone.Destination.volume.value = 0;

      // 2. Create a silent, persistent "anchor" node
      // This keeps the audio graph alive so later sounds are allowed
      const anchor = new Tone.Oscillator({
        frequency: 0,
        type: "sine"
      });

      const anchorGain = new Tone.Gain(0).toDestination();
      anchor.connect(anchorGain);
      anchor.start();

      anchorRef.current = { anchor, anchorGain };

      // 3. iOS / Safari media-element nudge (safe, silent)
      htmlAudioRef.current = new Audio(silentMP3);
      htmlAudioRef.current.loop = true;
      htmlAudioRef.current.volume = 0;

      try {
        await htmlAudioRef.current.play();
      } catch {
        // Desktop browsers may reject this — that's fine
      }

      // 4. Hand off control to the app
      onReady();
    } catch (err) {
      console.error("[AudioGate] Failed to start audio:", err);
      started.current = false; // allow retry if needed
    }
  };

  return <StartOverlay onStart={startAudio} />;
}
