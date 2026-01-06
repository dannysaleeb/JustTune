import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { MdOutlinePiano } from "react-icons/md";
import { PiWaveSineBold, PiWaveTriangleBold } from "react-icons/pi";
import * as Tone from "tone";

// controls import
import ToggleButton from "./controls/ToggleButton/ToggleButton";
import RadioButton from "./controls/RadioButton/RadioButton";

// settingsStyles for styling common to all components within Settings.jsx
import settingsStyles from "./styles/Settings.module.css";

// playbackStyles for styling specific to PlaybackSettings.jsx
import playbackStyles from "./styles/Playback.module.css";

export default function PlaybackSettings({settings, setSetting}) {
    return (
        <div className={settingsStyles.settingsItemContainer}>
            {/* Mute toggle */}
            <ToggleButton
                value={!settings.mute}
                onChange={ async () => {
                    await Tone.start();
                    setSetting("mute", !settings.mute)
                }}
                children={
                    !settings.mute
                    ? <HiMiniSpeakerWave size={38} />
                    : <HiMiniSpeakerXMark size={38} />
                }
                title="unmute / mute"
            />

            {/* Playback mode radio */}
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
