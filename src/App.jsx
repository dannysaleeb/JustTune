import { useState, useMemo } from "react";
import Piano from "./components/Piano";
import PartialSelector from "./components/PartialSelector";
import Notation from "./components/Notation";
import Playback from "./components/Playback";
// FrequencyControl is now imported inside Settings, not here
import Settings from "./components/Settings.jsx";
import { Fundamental } from "./classes/Partials.js";
import styles from "./App.module.css";
import { DEFAULT_SETTINGS, COLOURS } from "./config.js";

function App() {
  // --- STATE ---
  const [playTrigger, setPlayTrigger] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState("piano");

  const [midiKey, setMidiKey] = useState(null);
  const [partialNumbers, setPartialNumbers] = useState([]);
  const [flippedNotes, setFlippedNotes] = useState(Array(24).fill(false));
  const [tuningFactor, setTuningFactor] = useState(1);
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });

  const fundamental = useMemo(() => {
    if (midiKey == null) return null;
    const f = new Fundamental(midiKey, settings.enharmonicToggle);
    f.setFrequency(f.frequency * tuningFactor);
    return f;
  }, [midiKey, tuningFactor, settings.enharmonicToggle]);

  const partials = useMemo(() => {
    return partialNumbers
      .map(n => fundamental?.getPartial(n, flippedNotes[n - 1], settings))
      .filter(Boolean)
  }, [partialNumbers, fundamental, flippedNotes, settings]);

  return (
    <div className={styles.appContainer}>
      <div className={styles.title}>
        <h1>JUST TUNE</h1>
        <p>by Fintan O'Hare & Danny Saleeb</p>
        <p>after an original app by Martin Suckling</p>
      </div>

      <div className={styles.leftPanel}>
        {/* Logic-only Playback component */}
        <Playback
          partials={partials}
          settings={settings}
          playTrigger={playTrigger}
          isPlaying={isPlaying}
          mode={mode}
        />

        {/* Combined Settings Panel (Includes Freq Control & Playback UI) */}
        <div className={styles.settingsPanel}>
		  <div className={styles.panelHeader}>Settings</div>
          <Settings
            settings={settings}
            setSettings={setSettings}
            hideMaxPartials={true}
            flippedNotes={flippedNotes}
            setFlippedNotes={setFlippedNotes}
            // Playback Props
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            mode={mode}
            setMode={setMode}
            // Frequency Props
            tuningFactor={tuningFactor}
            setTuningFactor={setTuningFactor}
          />
        </div>
      </div>

      {/* NOTATION PANEL */}
      <div className={styles.notationPanel}>
        <Notation 
          partials={partials}
          settings={settings}
          setFlippedNotes={setFlippedNotes}
        />
      </div>

      {/* PARTIAL SELECTOR GRID PANEL */}
      <div className={styles.partialsPanel}>
        {/* ADDED HEADER */}
        <div className={styles.panelHeader}>Partials</div>
        <PartialSelector
          fundamental={fundamental}
          partialNumbers={partialNumbers}
          setPartialNumbers={setPartialNumbers}
          flippedNotes={flippedNotes}
          settings={settings}
          colours={COLOURS}
        />
      </div>

      {/* PIANO FUNDAMENTAL SELECTOR PANEL */}
      <div className={styles.pianoPanel}>
        {/* ADDED HEADER */}
        <div className={styles.panelHeader}>Fundamental</div>
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