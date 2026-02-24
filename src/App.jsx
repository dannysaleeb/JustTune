import { useEffect, useState, useMemo, useRef } from "react";
import * as Tone from "tone";

import useSettings from "./hooks/useSettings.jsx";
import { Fundamental } from "./classes/Partials.js";

import useLayoutMode from "./hooks/useLayoutMode";
import DesktopLayout from "./components/layout/DesktopLayout.jsx";
import MobileLayout from "./components/layout/MobileLayout.jsx";

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
  const [showInfo, setShowInfo] = useState(false);
  
  const [settings, setSetting, resetSettings] = useSettings();

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
    setPartialNumbers([]);
    setFlippedNotes(Array(24).fill(false));
  };

  // Escape key for reset
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMuteToggle = async () => {
    setSetting("mute", !settings.mute);
  };

  const appState = {
    midiKey,
    setMidiKey,
    partials,
    partialNumbers,
    setPartialNumbers,
    flippedNotes,
    setFlippedNotes,
    settings,
    setSetting,
    resetSettings,
    fundamental,
    showInfo,
    setShowInfo,
    handleReset,
    handleMuteToggle,
    playTrigger,
    setPlayTrigger
  }

  return (
    layoutMode === "desktop"
    ? <DesktopLayout {...appState} />
    : <MobileLayout {...appState} />
  );
}

export default App;
