import NotationSettings from "./NotationSettings";
import TuningSettings from "./TuningSettings";
import PlaybackSettings from "./PlaybackSettings";

import styles from "./styles/Settings.module.css";

export default function Settings({ fundamental, settings, setSetting }) {

  return (
    <div className={styles.settingsContainer}>

      <PlaybackSettings
        settings={settings}
        setSetting={setSetting}
      />

      <TuningSettings
        settings={settings}
        setSetting={setSetting}
      />

      <NotationSettings
        fundamental={fundamental}
        settings={settings}
        setSetting={setSetting}
      />
    </div>
  );
}
