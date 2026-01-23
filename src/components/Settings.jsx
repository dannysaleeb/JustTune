import NotationSettings from "./NotationSettings";
import TuningSettings from "./TuningSettings";
import PlaybackSettings from "./PlaybackSettings";

import styles from "./styles/Settings.module.css";

export default function Settings({ fundamental, settings, setSetting }) {
  return (
    <div className={styles.settingsContainer}>
      
      {/* SECTION 1: AUDIO */}
      <section className={styles.settingsSection}>
        <h3 className={styles.sectionHeader}>Playback</h3>
        <PlaybackSettings
          settings={settings}
          setSetting={setSetting}
        />
      </section>

      {/* SECTION 2: TUNING */}
      <section className={styles.settingsSection}>
        <h3 className={styles.sectionHeader}>Tuning</h3>
        <TuningSettings
          settings={settings}
          setSetting={setSetting}
        />
      </section>

      {/* SECTION 3: NOTATION */}
      <section className={styles.settingsSection}>
        <h3 className={styles.sectionHeader}>Notation</h3>
        <NotationSettings
          fundamental={fundamental}
          settings={settings}
          setSetting={setSetting}
        />
      </section>
      
    </div>
  );
}