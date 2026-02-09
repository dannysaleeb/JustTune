import Controls from "./settings_components/Controls.jsx";
import NotationSettings from "./settings_components/NotationSettings.jsx";
import TuningSettings from "./settings_components/TuningSettings.jsx";
import PlaybackSettings from "./settings_components/PlaybackSettings.jsx";

import styles from "./settings_styles/Settings.module.css";

export default function SettingsDesktop({ fundamental, settings, setSetting, showInfo, setShowInfo, handleReset }) {
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
