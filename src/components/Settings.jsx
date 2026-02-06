import NotationSettings from "./NotationSettings";
import TuningSettings from "./TuningSettings";
import PlaybackSettings from "./PlaybackSettings";

import styles from "./styles/Settings.module.css";

export default function Settings({ fundamental, settings, setSetting }) {
  return (
    <div className={styles.settingsContainer}>

      {/* SECTION 2: CONTROL */}
      {/* <Controls

      /> */}
      
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
