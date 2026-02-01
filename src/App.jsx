import { useEffect, useState, useMemo, useRef } from "react";
import * as Tone from "tone";

import useSettings from "./hooks/useSettings.jsx";
import { Fundamental } from "./classes/Partials.js";

import useLayoutMode from "./hooks/useLayoutMode";
import DesktopLayout from "./components/DesktopLayout.jsx";
import MobileLayout from "./components/MobileLayout.jsx";

import Playback from "./components/Playback";
import silentMP3 from "./assets/audio/silence.mp3";

function App() {

  const layoutMode = useLayoutMode();

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("jt-desktop", layoutMode === "desktop");
    root.classList.toggle("jt-mobile", layoutMode === "mobile");

    if (layoutMode === "desktop") root.classList.remove("jt-mobile");
    if (layoutMode === "mobile") root.classList.remove("jt-desktop");
    
  }, [layoutMode])

  const [playTrigger, setPlayTrigger] = useState(0);
  const [midiKey, setMidiKey] = useState(null);
  const [partialNumbers, setPartialNumbers] = useState([]);
  const [flippedNotes, setFlippedNotes] = useState(Array(24).fill(false));
  
  const [hasStarted, setHasStarted] = useState(false);
  const [settings, setSetting, resetSettings] = useSettings();

  // Reference for the silent audio element
  const silentAudioRef = useRef(null);

  // --- Logic ---
  const fundamental = useMemo(() => {
    if (midiKey == null) return null;
    const f = new Fundamental(midiKey, settings.enharmonicToggle);
    f.setFrequency(f.frequency * (settings.tuningFrequency / 440));
    return f;
  }, [midiKey, settings.tuningFrequency, settings.enharmonicToggle]);

  const partials = useMemo(() => {
    return partialNumbers
      .map(n => fundamental?.getPartial(n, flippedNotes[n - 1], settings))
      .filter(Boolean);
  }, [partialNumbers, fundamental, flippedNotes, settings]);

  const handleReset = () => {
    resetSettings();
    setPlayTrigger(0);
    setMidiKey(null);
    setPartialNumbers([]);
    setFlippedNotes(Array(24).fill(false));
  };

  const handleMuteToggle = async () => {
    await Tone.start();
    setSetting("mute", !settings.mute);
  };
  
  // --- THE UPDATED START HANDLER ---
  const handleStart = async () => {
    // 1. Unlock the Web Audio Context
    await Tone.start();

    // 2. Play the hidden silent audio tag (Nuclear Option for Mute Switches)
	<audio ref={silentAudioRef} src={silentMP3} loop playsInline />

    // 3. SILENT Oscillator kickstart (Forces hardware activation)
    // We connect to a gain of 0 so it is perfectly silent.
    const silentGain = new Tone.Gain(0).toDestination();
    const kickstart = new Tone.Oscillator().connect(silentGain);
    
    kickstart.start().stop("+0.1");

    // Clean up nodes after the burst
    setTimeout(() => {
      kickstart.dispose();
      silentGain.dispose();
    }, 200);

    setHasStarted(true);
  };

  const appState = {
    midiKey,
    setMidiKey,
    partials,
    partialNumbers,
    setPartialNumbers,
    flippedNotes,
    setFlippedNotes,
    playTrigger,
    setPlayTrigger,
    settings,
    setSetting,
    resetSettings,
    fundamental
  }

  return (
    layoutMode === "desktop"
    ? <DesktopLayout {...appState} />
    : <MobileLayout {...appState} />
  );
}

export default App;
