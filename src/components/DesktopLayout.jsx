import { COLOURS } from "../config.js";

import styles from "./styles/DesktopLayout.module.css";

import Settings from "./Settings.jsx";
import Notation from "./Notation.jsx";
import PartialSelector from "./PartialSelector.jsx";
import Piano from "./Piano.jsx"
import Playback from "./Playback.jsx";

export default function DesktopLayout({
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
  return (

    <div className={styles.desktop}>
      
      <div className={styles.leftPanel}>
        <Playback 
          partials={partials} 
          settings={settings}
          playTrigger={playTrigger}
        />

        <Settings
          fundamental={fundamental}
          settings={settings}
          setSetting={setSetting}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          handleReset={handleReset}
        />
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
  );
}
