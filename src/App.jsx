import { useState, useMemo } from "react";
import { CiSettings } from "react-icons/ci";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2"; 
import * as Tone from "tone";
import styles from "./App.module.css";

// Hooks, Classes, Config
import useSettings from "./hooks/useSettings.jsx";
import { COLOURS } from "./config.js";
import { Fundamental } from "./classes/Partials.js";

// Components
import Piano from "./components/Piano";
import PartialSelector from "./components/PartialSelector";
import Notation from "./components/Notation";
import Playback from "./components/Playback";
import Settings from "./components/Settings.jsx";
import InfoPopup from "./components/InfoPopup";
import ResetButton from "./components/ResetButton";
import ToggleButton from "./components/controls/ToggleButton/ToggleButton";

function App() {
  const [playTrigger, setPlayTrigger] = useState(0);
  const [midiKey, setMidiKey] = useState(null);
  const [partialNumbers, setPartialNumbers] = useState([]);
  const [flippedNotes, setFlippedNotes] = useState(Array(24).fill(false));
  const [showPopup, setShowPopup] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [settings, setSetting, resetSettings] = useSettings();

  // --- Logic ---
  const fundamental = useMemo(() => {
    if (midiKey == null) return null;
    const f = new Fundamental(midiKey, settings.enharmonicToggle);
    f.setFrequency(f.frequency * (settings.tuningFrequency / 440));
    return f;
  }, [midiKey, settings.tuningFrequency, settings.enharmonicToggle, settings.use12EDO]);

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

  return (
    <div className={styles.appContainer}>
      
      {/* LEFT COLUMN WRAPPER: Handles the uneven vertical split */}
      <div className={styles.leftColumnWrapper}>
        
        {/* HEADER PANEL */}
        <div className={`${styles.panel} ${styles.headerPanel}`}>
          <span style={{ 
            fontFamily: '"Amatica SC", sans-serif', 
            fontWeight: 500, 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            textTransform: 'uppercase',
            color: '#444',
            lineHeight: 1
          }}>
            Just Tune
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <InfoPopup onClick={() => setShowInfo(true)} />
            <ResetButton onReset={handleReset} />
            
            <ToggleButton
              value={!settings.mute}
              onChange={handleMuteToggle}
              title="unmute / mute"
            >
              {!settings.mute 
                ? <HiMiniSpeakerWave size={24} /> 
                : <HiMiniSpeakerXMark size={24} />
              }
            </ToggleButton>

            {/* Settings Toggle: only visible on mobile */}
            <div className={styles.settingsToggle}>
              <ToggleButton
                onChange={() => setShowPopup(true)}
                title="Open Settings"
              >
                <CiSettings style={{ width: '1.5em', height: '1.5em' }} />
              </ToggleButton>
            </div>
          </div>
        </div>

        {/* SETTINGS PANEL: Stretches to fill available space */}
        <div className={`${styles.panel} ${styles.optionalSettings}`}>
          <Playback partials={partials} settings={settings} playTrigger={playTrigger} />
          <Settings fundamental={fundamental} settings={settings} setSetting={setSetting} />
        </div>
      </div>

      {/* RIGHT COLUMN: Standard Stack */}
      <div className={`${styles.panel} ${styles.notationPanel}`}>
        <Notation partials={partials} settings={settings} setFlippedNotes={setFlippedNotes} />
      </div>

      <div className={`${styles.panel} ${styles.partialsPanel}`}>
        <PartialSelector
          fundamental={fundamental}
          partialNumbers={partialNumbers}
          setPartialNumbers={setPartialNumbers}
          flippedNotes={flippedNotes}
          settings={settings}
          colours={COLOURS}
        />
      </div>

      <div className={`${styles.panel} ${styles.pianoPanel}`}>
        <Piano
          midiKey={midiKey}
          setMidiKey={setMidiKey}
          setFlippedNotes={setFlippedNotes}
          setPlayTrigger={setPlayTrigger}
        />
      </div>

      {/* MODALS */}
      {showPopup && (
        <div className={styles.modalOverlay} onClick={() => setShowPopup(false)}>
          <div className={`${styles.panel} ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalBody}>
               <Settings fundamental={fundamental} settings={settings} setSetting={setSetting} />
            </div>
            <button className={styles.closeButton} onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {showInfo && (
        <div className={styles.modalOverlay} onClick={() => setShowInfo(false)}>
          <div className={`${styles.panel} ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalBody}>
              <h2 className={styles.panelHeader}>About</h2>
              <p>Fintan O'Hare & Danny Saleeb</p>
              <p>Based on an original app by Clement Power & Martin Suckling</p>
              
              <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                <ul className={styles.infoList}>
                  <li>Select a fundamental with the piano</li>
                  <li>Choose partials in the grid</li>
                  <li>Display enharmonic by pressing a note</li>
                </ul>
              </div>
            </div>
            <button className={styles.closeButton} onClick={() => setShowInfo(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;