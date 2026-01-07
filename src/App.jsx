import { useState, useMemo, useEffect } from "react";
import useSettings from "./hooks/useSettings.jsx";

import Piano from "./components/Piano";
import PartialSelector from "./components/PartialSelector";
import Notation from "./components/Notation";
import Playback from "./components/Playback";
import Settings from "./components/Settings.jsx";

import { Fundamental } from "./classes/Partials.js";

import styles from "./App.module.css";
import { COLOURS } from "./config.js";

import InfoPopup from "./components/InfoPopup";
import ResetButton from "./components/ResetButton";

function App() {
  const [playTrigger, setPlayTrigger] = useState(0);
  const [midiKey, setMidiKey] = useState(null);
  const [partialNumbers, setPartialNumbers] = useState([]);
  const [flippedNotes, setFlippedNotes] = useState(Array(24).fill(false));

  // ⬇️ TAKE resetSettings FROM THE HOOK
  const [settings, setSetting, resetSettings] = useSettings();

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

  // --- SOFT RESET ---
  const handleReset = () => {
    // reset persisted + default settings
    resetSettings();

    // reset local / musical state
    setPlayTrigger(0);
    setMidiKey(null);
    setPartialNumbers([]);
    setFlippedNotes(Array(24).fill(false));
  };
  
	// Hidden flag to auto-deselect ±50¢ buttons
	const AUTO_DESELECT_50C = true;

	useEffect(() => {
	  if (!AUTO_DESELECT_50C) return;
	  if (!fundamental) return;

	  if (settings.centDeviation != 0) {
		setSetting("centDeviation", 0);
	  }
	}, [fundamental]);

  // --- ESC key handling ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  


  return (
    <div className={styles.appContainer}>
      
      {/* NEW WRAPPER: HEADER PANEL 
        Groups Buttons and Title into the Top-Left Grid Cell 
      */}
      <div className={styles.headerPanel}>
        {/* Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <InfoPopup />
          <ResetButton onReset={handleReset} />
        </div>

        {/* Title */}
        <div className={styles.title}>
          <h1>JUST TUNE</h1>
          <p>
            <span className={styles.smallTextStyle}>by</span> Fintan O'Hare & Danny Saleeb
          </p>
          <p>
            <span className={styles.smallTextStyle}>after an original app by</span>{" "}
            Clement Power & Martin Suckling
          </p>
        </div>
      </div>

      {/* Left panel (Settings) */}
      <div className={styles.leftPanel} title={"SETTINGS"}>
        <Playback
          partials={partials}
          settings={settings}
          playTrigger={playTrigger}
        />
        <div className={styles.settingsPanel}>
          <Settings
            fundamental={fundamental}
            settings={settings}
            setSetting={setSetting}
          />
        </div>
      </div>

      {/* Notation */}
      <div className={styles.notationPanel} title={"NOTATION"}>
        <Notation
          partials={partials}
          settings={settings}
          setFlippedNotes={setFlippedNotes}
        />
      </div>

      {/* Partials */}
      <div className={styles.partialsPanel} title={"PARTIALS"}>
        <PartialSelector
          fundamental={fundamental}
          partialNumbers={partialNumbers}
          setPartialNumbers={setPartialNumbers}
          flippedNotes={flippedNotes}
          settings={settings}
          colours={COLOURS}
        />
      </div>

      {/* Piano */}
      <div className={styles.pianoPanel} title={"FUNDAMENTAL"}>
        <Piano
          midiKey={midiKey}
          setMidiKey={setMidiKey}
          setFlippedNotes={setFlippedNotes}
          setPlayTrigger={setPlayTrigger}
        />
      </div>
    </div>
  );
}

export default App;