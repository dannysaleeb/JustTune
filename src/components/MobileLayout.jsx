import { COLOURS } from "../config.js";
import { useState } from "react";

import styles from "./styles/MobileLayout.module.css";

import SettingsHeader from "./settings/components/SettingsHeader.jsx";
import SettingsMobile from "./settings/SettingsMobile.jsx";
import Notation from "./Notation.jsx";
import PartialSelector from "./PartialSelector.jsx";
import Piano from "./Piano.jsx"
import Playback from "./Playback.jsx";

export default function MobileLayout({
  partials,
  partialNumbers,
  setPartialNumbers,
  settings,
  setSetting,
  fundamental,
  flippedNotes,
  setFlippedNotes,
  midiKey,
  setMidiKey,
  showInfo,
  setShowInfo,
  handleReset,
  playTrigger,
  setPlayTrigger
}) {

  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={styles.mobile}>
      
      <div>
        <Playback
          partials={partials} 
          settings={settings}
          playTrigger={playTrigger}
        />
        <SettingsHeader 
          settings={settings}
          setSetting={setSetting}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          handleReset={handleReset}
          setShowSettings={setShowSettings}
        />

        {showSettings && 
          <div className={styles.modalOverlay} onClick={() => setShowPopup(false)}>
            <div className={`${styles.panel} ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalBody}>
                <SettingsMobile 
                  fundamental={fundamental} 
                  settings={settings} 
                  setSetting={setSetting} 
                />
              </div>
              <button className={styles.closeButton} onClick={() => setShowSettings(false)}>Close</button>
            </div>
          </div>
        }
      </div>

      <div className={styles.notationPanel}>
        <Notation 
          width={600}
          height={280}
          partials={partials} 
          settings={settings} 
          setFlippedNotes={setFlippedNotes}
        />
      </div>

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

      <div className={styles.pianoPanel}>
        <Piano 
          midiKey={midiKey}
          setMidiKey={setMidiKey}
          setFlippedNotes={setFlippedNotes}
          playTrigger={playTrigger}
          setPlayTrigger={setPlayTrigger}
        />
      </div>
    </div>
  )
}
