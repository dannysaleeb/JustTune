import { useState, useMemo } from "react";
import Piano from "./components/Piano";
import PartialSelector from "./components/PartialSelector";
import Notation from "./components/Notation";
import Playback from "./components/Playback";
import FrequencyControl from "./components/FrequencyControl";
import { Fundamental } from "./classes/Partials.js";

import styles from "./App.module.css";

import { DEFAULT_SETTINGS, COLOURS } from "./config.js";

function App() {
  
  const [midiKey, setMidiKey] = useState(null);
  const [partialNumbers, setPartialNumbers] = useState([]);
  const [flippedNotes, setFlippedNotes] = useState(Array(24).fill(false));
  const [tuningFactor, setTuningFactor] = useState(1);

  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });

  const fundamental = useMemo(() => {
    if (midiKey == null) return null;
    const f = new Fundamental(midiKey);
    f.setFrequency(f.frequency * tuningFactor);
    return f;
  }, [midiKey, tuningFactor]);

  const partials = useMemo(() => {
    return partialNumbers
      .map(n => fundamental?.getPartial(n, flippedNotes[n - 1], settings))
      .filter(Boolean)
  }, [partialNumbers, fundamental, flippedNotes]);

  const [maxPartials, setMaxPartials] = useState(8);

  return (
    <div className={styles.appContainer}>
      <div className={styles.title}>
        <h1>JUST TUNE</h1>
        <p>by Fintan O'Hare & Danny Saleeb</p>
        <p>after an original app by Martin Suckling</p>
      </div>

      {/* LEFT PANEL // CONTROLS & SETTINGS */}
      <div className={styles.leftPanel}>
        
        <div className={styles.controls}>
          <Playback 
            partials={partials}
            maxPartials={maxPartials}
          />
        </div>

        <div className={styles.settings}>
          <FrequencyControl
            tuningFactor={tuningFactor}
            setTuningFactor={setTuningFactor}
            disabled={!fundamental}
          />
        </div>

      </div>

      {/* NOTATION PANEL */}
      <div className={styles.notationPanel}>
        <Notation 
          partials={partials}
          maxPartials={maxPartials}
          setFlippedNotes={setFlippedNotes}
        />
      </div>

      {/* PARTIAL SELECTOR GRID PANEL */}
      <div className={styles.partialsPanel}>
        <PartialSelector
          fundamental={fundamental}
          maxPartials={maxPartials}
          partialNumbers={partialNumbers}
          setPartialNumbers={setPartialNumbers}
          flippedNotes={flippedNotes}
          colours={COLOURS}
        />
      </div>

      {/* PIANO FUNDAMENTAL SELECTOR PANEL */}
      <div className={styles.pianoPanel}>
        <Piano
          midiKey={midiKey}
          setMidiKey={setMidiKey}
          setFlippedNotes={setFlippedNotes}
        />
      </div>   
         
    </div>
  );
}

export default App;
