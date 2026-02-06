import Controls from "./Controls.jsx";
import NotationSettings from "./NotationSettings";
import TuningSettings from "./TuningSettings";
import PlaybackSettings from "./PlaybackSettings";

import styles from "./styles/Settings.module.css";

export default function Settings({ fundamental, settings, setSetting, showInfo, setShowInfo, handleReset }) {
  return (
    <div className={styles.settingsContainer}>

      {/* SECTION 2: CONTROL */}
      <Controls
        settings={settings}
        setSetting={setSetting}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        handleReset={handleReset}
      />
      
      {/* SECTION 1: AUDIO */}
      <PlaybackSettings
        settings={settings}
        setSetting={setSetting}
      />

      {/* SECTION 2: TUNING */}
      <TuningSettings
        settings={settings}
        setSetting={setSetting}
      />

      {/* SECTION 3: NOTATION */}
      <NotationSettings
        fundamental={fundamental}
        settings={settings}
        setSetting={setSetting}
      />
    </div>
  );
}
