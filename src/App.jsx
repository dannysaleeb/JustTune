import { useState, useMemo, useRef } from "react";
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

    // <div className={styles.appContainer}>
    //   {/* 1. START OVERLAY */}
    //   {!hasStarted && <StartOverlay onStart={handleStart} />}

    //   {/* 2. HIDDEN SILENT AUDIO ELEMENT */}
    //   <audio 
    //     ref={silentAudioRef}
    //     loop 
    //     playsInline 
    //     src="data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=="
    //   />
      
    //   <div className={styles.leftColumnWrapper}>
        
    //     {/* HEADER PANEL */}
    //     <div className={`${styles.panel} ${styles.headerPanel}`}>
    //       <span style={{ 
    //         fontFamily: '"Amatica SC", sans-serif', 
    //         fontWeight: 500, 
    //         fontSize: 'clamp(2rem, 5vw, 3rem)', 
    //         textTransform: 'uppercase',
    //         color: '#444',
    //         lineHeight: 1
    //       }}>
    //         Just Tune
    //       </span>

    //       <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    //         <InfoPopup onClick={() => setShowInfo(true)} />
    //         <ResetButton onReset={handleReset} />
            
    //         <ToggleButton
    //           value={!settings.mute}
    //           onChange={handleMuteToggle}
    //           title="unmute / mute"
    //         >
    //           {!settings.mute 
    //             ? <HiMiniSpeakerWave size={24} /> 
    //             : <HiMiniSpeakerXMark size={24} />
    //           }
    //         </ToggleButton>

    //         <div className={styles.settingsToggle}>
    //           <ToggleButton
    //             onChange={() => setShowPopup(true)}
    //             title="Open Settings"
    //           >
    //             <CiSettings style={{ width: '1.5em', height: '1.5em' }} />
    //           </ToggleButton>
    //         </div>
    //       </div>
    //     </div>

    //     {/* SETTINGS PANEL */}
    //     <div className={`${styles.panel} ${styles.optionalSettings}`}>
    //       {hasStarted && (
    //         <Playback 
    //           partials={partials} 
    //           settings={settings} 
    //           playTrigger={playTrigger}
    //         />
    //       )}
    //       <Settings fundamental={fundamental} settings={settings} setSetting={setSetting} />
    //     </div>
    //   </div>

    //   <div className={`${styles.panel} ${styles.notationPanel}`}>
    //     <Notation partials={partials} settings={settings} setFlippedNotes={setFlippedNotes} />
    //   </div>

    //   <div className={`${styles.panel} ${styles.partialsPanel}`}>
    //     <PartialSelector
    //       fundamental={fundamental}
    //       partialNumbers={partialNumbers}
    //       setPartialNumbers={setPartialNumbers}
    //       flippedNotes={flippedNotes}
    //       settings={settings}
    //       colours={COLOURS}
    //     />
    //   </div>

    //   <div className={`${styles.panel} ${styles.pianoPanel}`}>
    //     <Piano
    //       midiKey={midiKey}
    //       setMidiKey={setMidiKey}
    //       setFlippedNotes={setFlippedNotes}
    //       setPlayTrigger={setPlayTrigger}
    //     />
    //   </div>

    //   {/* MODALS */}
    //   {showPopup && (
    //     <div className={styles.modalOverlay} onClick={() => setShowPopup(false)}>
    //       <div className={`${styles.panel} ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
    //         <div className={styles.modalBody}>
    //            <Settings fundamental={fundamental} settings={settings} setSetting={setSetting} />
    //         </div>
    //         <button className={styles.closeButton} onClick={() => setShowPopup(false)}>Close</button>
    //       </div>
    //     </div>
    //   )}

    //   {showInfo && (
    //     <div className={styles.modalOverlay} onClick={() => setShowInfo(false)}>
    //       <div className={`${styles.panel} ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
    //         <div className={styles.modalBody}>
    //           <h2 className={styles.panelHeader}>About</h2>
    //           <p>Fintan O'Hare & Danny Saleeb</p>
    //           <p>Based on an original app by Clement Power & Martin Suckling</p>
    //           <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
    //             <ul className={styles.infoList}>
    //               <li>Select a fundamental with the piano</li>
    //               <li>Choose partials in the grid</li>
    //               <li>Display enharmonic by pressing a note</li>
    //             </ul>
    //           </div>
    //         </div>
    //         <button className={styles.closeButton} onClick={() => setShowInfo(false)}>Close</button>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
}

export default App;
