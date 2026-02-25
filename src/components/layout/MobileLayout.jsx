import { COLOURS } from "../../config.js";
import { useState } from "react";

import styles from "./layout_styles/MobileLayout.module.css";

import SettingsHeader from "../settings/settings_components/SettingsHeader.jsx";
import SettingsMobile from "../settings/SettingsMobile.jsx";
import Notation from "../main/Notation.jsx";
import PartialSelector from "../main/PartialSelector.jsx";
import Piano from "../main/Piano.jsx"
import Playback from "../main/Playback.jsx";

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
      
      <div className={`${styles.panel} ${styles.headerPanel}`}>
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
          <div className={styles.modalOverlay} onClick={() => setShowSettings(false)}>
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

      <div className={`${styles.panel} ${styles.notationPanel}`}>
        <Notation
          partials={partials} 
          settings={settings} 
          setFlippedNotes={setFlippedNotes}
        />
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
          playTrigger={playTrigger}
          setPlayTrigger={setPlayTrigger}
          setSetting={setSetting}
        />
      </div>

		{showInfo && (
		  <div className={styles.modalOverlay} onClick={() => setShowInfo(false)}>
		    <div className={`${styles.panel} ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
		      <div className={styles.modalBody}>
		        {/* Changed span to div to fix DOM nesting crash */}
		        <div style={{ fontStyle: "italic" }}>
		          <p><strong>Just Tune</strong>, 2026 - version 2.0</p>
		          <p>by Fintan O'Hare & Danny Saleeb, after an original app by Martin Suckling.</p>
		          <p>Commissioned by Clement Power with funding from the mdw - University of Music and Performing Arts Vienna.</p>
		        </div>
		
		        <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
		          <ul className={styles.infoList}>
		            <li>Select a fundamental with the piano</li>
		            <li>Choose partials in the grid</li>
		            <li>Display enharmonic by clicking a note</li>
		          </ul>
		        </div>
		      </div>
		      <button className={styles.closeButton} onClick={() => setShowInfo(false)}>Close</button>
		    </div>
		  </div>
		)}
    </div>
  )
}
