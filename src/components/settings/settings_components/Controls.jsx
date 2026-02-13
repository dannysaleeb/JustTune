import InfoPopup from "./InfoPopup.jsx";
import ResetButton from "../../controls/ResetButton.jsx";
import ToggleButton from "../../controls/ToggleButton.jsx";

import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2"; 

import styles from "../settings_styles/Controls.module.css"
import settingsStyles from "../settings_styles/Settings.module.css";

export default function Controls({settings, setSetting, showInfo, setShowInfo, handleReset, handleMuteToggle }) {
    return (
        <div className={settingsStyles.settingsItemContainer}>
            <div>
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
              <div style={{ fontSize: "var(--control-label-font-size" }}>mute/unmute</div>
            </div>

            <div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "var(--control-gap)" }}>
                <InfoPopup onClick={() => setShowInfo(true)}/>
                <ResetButton onReset={handleReset} />
              </div>
              <div style={{ fontSize: "var(--control-label-font-size" }}>info & reset</div>
            </div>
            
            {/* MODAL STUFF */}
            {showInfo && (
                <div className={styles.modalOverlay} onClick={() => setShowInfo(false)}>
                <div className={`${styles.panel} ${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalBody}>
                    <h2 className={styles.panelHeader}>About</h2>
                    <p>Fintan O'Hare & Danny Saleeb</p>
                    <p>Based on an original app by Martin Suckling</p>
					<p>Commissioned by Clement Power with funding from the mdw - University of Music and Performing Arts Vienna</p>
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
