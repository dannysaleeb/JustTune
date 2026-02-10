import styles from "../settings_styles/Settings.module.css";

import { CiSettings } from "react-icons/ci";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2"; 

import InfoPopup from "./InfoPopup.jsx";
import ResetButton from "../../controls/ResetButton.jsx";
import ToggleButton from "../../controls/ToggleButton.jsx";

export default function SettingsHeader({ settings, setSetting, showInfo, setShowInfo, handleReset, setShowSettings }) {
  return (
    <>
        <span style={{ 
            fontFamily: '"Amatica SC", sans-serif', 
            fontWeight: 500, 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            textTransform: 'uppercase',
            color: '#444',
            lineHeight: 1
        }}>
            just tune <span style={{ fontSize: "20px" }}>v2.0</span>
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        
            <InfoPopup onClick={() => setShowInfo(true)} />
            {/* MODAL STUFF */}

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
    </>
  );
}
