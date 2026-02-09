import { COLOURS } from "../../config.js";

import styles from "./layout_styles/DesktopLayout.module.css";

import SettingsDesktop from "../settings/SettingsDesktop.jsx";
import Notation from "../main/Notation.jsx";
import PartialSelector from "../main/PartialSelector.jsx";
import Piano from "../main/Piano.jsx"
import Playback from "../main/Playback.jsx";

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
      <div style={{ fontFamily: "Amatica SC", fontWeight: "100", fontSize: "95px", margin: "0", lineHeight: "0.8", paddingLeft: "4px"}}>
        just tune <span style={{ fontSize: "28px" }}>v2.0</span>
      </div>
      <div className={styles.leftPanel}>
        <Playback 
          partials={partials} 
          settings={settings}
          playTrigger={playTrigger}
        />

        <SettingsDesktop
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
