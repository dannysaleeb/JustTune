import styles from "../../styles/MobileLayout.module.css";

import { CiSettings } from "react-icons/ci";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2"; 

import InfoPopup from "./InfoPopup.jsx";
import ResetButton from "./ResetButton.jsx";
import ToggleButton from "./controls/ToggleButton/ToggleButton.jsx";

export default function SettingsHeader({ settings, setSetting, showInfo, setShowInfo, handleReset, setShowSettings }) {
  return (
    <div>
        <div className={`${styles.panel} ${styles.headerPanel}`}>
            <span style={{ 
                fontFamily: '"Amatica SC", sans-serif', 
                fontWeight: 500, 
                fontSize: 'clamp(2rem, 5vw, 3rem)', 
                textTransform: 'uppercase',
                color: '#444',
                lineHeight: 1
            }}>
                just tune
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
                <InfoPopup onClick={() => setShowInfo(true)} />
                {/* MODAL STUFF */}
                {showInfo && (
                    <div className={styles.modalOverlay} onClick={() => setShowInfo(false)}>
                    <div className={`${styles.panel} ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalBody}>
                        <h2 className={styles.panelHeader}>About</h2>
                        <p>Fintan O'Hare & Danny Saleeb</p>
                        <p>Based on an original app by Clement Power & Martin Suckling</p>
                        <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                            <ul className={styles.infoList}>
                            <li>Select a fundamental with the piano</li>
                            <li>Choose partials in the grid</li>
                            <li>Display enharmonic by pressing a note</li>
                            </ul>
                        </div>
                        </div>
                        <button className={styles.closeButton} onClick={() => setShowInfo(false)}>Close</button>
                    </div>
                    </div>
                )}

                <ResetButton onReset={handleReset} />
                <ToggleButton
                    value={!settings.mute}
                    onChange={() => setSetting("mute", !settings.mute)}
                    title="unmute / mute"
                >
                    {!settings.mute 
                    ? <HiMiniSpeakerWave size={24} /> 
                    : <HiMiniSpeakerXMark size={24} />
                    }
                </ToggleButton>

                <div className={styles.settingsToggle}>
                    <ToggleButton
                        onChange={() => setShowSettings(true)}
                        title="Open Settings"
                    >
                    <CiSettings style={{ width: '1.5em', height: '1.5em' }} />
                    </ToggleButton>
                </div>
            </div>

            
        </div>
    </div>
  );
}
