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
        </div>
    )
}