// MAIN APP:
import { useState, useMemo, useEffect } from "react";
import Piano from "./components/Piano";
import PartialSelector from "./components/PartialSelector";
import Notation from "./components/Notation";
import Playback from "./components/Playback";
import FrequencyControl from "./components/FrequencyControl";
import Settings from "./components/Settings.jsx";
import { Fundamental } from "./classes/Partials.js";

import styles from "./App.module.css";

import { DEFAULT_SETTINGS, COLOURS } from "./config.js";

function App() {
  
  // ADDED: State to force playback re-trigger on same key press
  const [playTrigger, setPlayTrigger] = useState(0); 

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
	  {/* --- Top row: audio + frequency --- */}
		<div
		  style={{
			display: "flex",
			alignItems: "flex-start",  // top-align
			gap: "12px",
			justifyContent: "flex-start",
			marginBottom: "18px",
			flexWrap: "nowrap",
			width: "100%",  // ensure it fills the panel
		  }}
		>
		  <Playback
			partials={partials}
			settings={settings}
			setSettings={setSettings}
			playTrigger={playTrigger}
		  />
		  
		  <div style={{ marginLeft: "auto" }}>
			<FrequencyControl
			  tuningFactor={tuningFactor}
			  setTuningFactor={setTuningFactor}
			  disabled={false}
			/>
		  </div>
		</div>

	  {/* --- Second row: audio buttons + third row: JI/12-EDO --- */}
	  <div>
		<Settings
		  settings={settings}
		  setSettings={setSettings}
		  flippedNotes={flippedNotes}
		  setFlippedNotes={setFlippedNotes}
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
        <Piano
          midiKey={midiKey}
          setMidiKey={setMidiKey}
          setFlippedNotes={setFlippedNotes}
          // PASSED: trigger setter
          setPlayTrigger={setPlayTrigger} 
        />
      </div>   
         
    </div>
  );
}

export default App;