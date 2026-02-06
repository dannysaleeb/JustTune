import { MdOutlinePiano } from "react-icons/md";
import { PiWaveSineBold, PiWaveTriangleBold } from "react-icons/pi";

// controls import
import RadioButton from "./controls/RadioButton/RadioButton";
import settingsStyles from "./styles/Settings.module.css";

export default function PlaybackSettings({settings, setSetting}) {
    return (
        <div className={settingsStyles.settingsItemContainer}>
            {/* Playback mode radio - Now the primary control here */}
            <RadioButton
                selected={settings.playbackMode}
                options={["piano", "triangle", "sine"]}
                label="playback sound"
                onChange={(option) => setSetting("playbackMode", option)}
                renderOption={(option) => {
                    const icons = {
                        "piano": <MdOutlinePiano size={24} />,
                        "triangle": <PiWaveTriangleBold size={24} />,
                        "sine": <PiWaveSineBold size={24} />
                    };
                    
                    return icons[option]
                }}
            />

            {/* Column 1: Tuning System */}
            <RadioButton
                // Map the boolean use12EDO back to the UI strings
                selected={settings.use12EDO ? "12EDO" : "JI"}
                options={["JI", "12EDO"]}
                label="tuning"
                // Update use12EDO based on the selection
                onChange={(option) => setSetting("use12EDO", option === "12EDO")}
                renderOption={(option) => (
                    <span style={{ 
                    fontSize: option === "12EDO" 
                        ? "clamp(0.6rem, 1.2vw, 0.75rem)" 
                        : "clamp(0.7rem, 1.5vw, 0.9rem)", 
                    fontWeight: "bold",
                    lineHeight: "1",
                    whiteSpace: "nowrap"
                    }}>
                    {option}
                    </span>
                )}
            />
        </div>
    )
}
