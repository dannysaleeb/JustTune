import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { MdOutlinePiano } from "react-icons/md";
import { PiWaveSineBold, PiWaveTriangleBold } from "react-icons/pi";
import * as Tone from "tone";

import FrequencyControl from "./FrequencyControl";

import doubleSharpsIcon from "../icons/doublesharps.svg";
import doubleSharpsInactive from "../icons/doublesharps_inactive.svg";
import showNaturalsIcon from "../icons/shownaturals.svg";
import hideNaturalsIcon from "../icons/hidenaturals.svg";
import showColoursIcon from "../icons/showcolours.svg";
import hideColoursIcon from "../icons/hidecolours.svg";
import enharmonicsIcon from "../icons/enharmonics.svg";
import playbackStyles from "./styles/playback.module.css";

export default function Settings({ 
  settings, 
  setSettings, 
  hideMaxPartials = false,
  isPlaying, setIsPlaying,
  mode, setMode,
  tuningFactor, setTuningFactor
}) {
  
  // -- LAYOUT STYLES --
  // Forces children to share width equally
  const rowStyle = {
    display: "flex",
    width: "100%",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "space-between"
  };

  // Makes individual items fill their share of the row
  const itemStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 0, // prevents flex overflow issues
  };

  const buttonReset = {
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
  };

  // Handler for Tone.js context
  const handleTogglePlay = async () => {
    await Tone.start();
    setIsPlaying(!isPlaying);
  };

  const handleModeChange = async (newMode) => {
    await Tone.start();
    setMode(newMode);
  };

  const setUse12EDO = (val) => setSettings(p => ({ ...p, use12EDO: val }));

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      
      {/* --- ROW 1: Play/Stop + Frequency Control --- */}
      <div style={rowStyle}>
        {/* Play Button */}
        <button
          className={`${playbackStyles.playbackButton} ${isPlaying ? playbackStyles.active : playbackStyles.inactive}`}
          style={{ ...itemStyle, height: "auto", aspectRatio: "unset", borderRadius: "8px" }} // Override circular styles
          onClick={handleTogglePlay}
        >
          {isPlaying
            ? <HiMiniSpeakerWave size={38} />
            : <HiMiniSpeakerXMark size={38} />}
        </button>

        {/* Frequency Control Wrapper */}
        <div style={{...itemStyle, background: "#f5f5f5", borderRadius: "8px", padding: "4px"}}>
            <FrequencyControl 
                tuningFactor={tuningFactor} 
                setTuningFactor={setTuningFactor} 
                disabled={false} 
            />
        </div>
      </div>

      {/* --- ROW 2: Instrument Select --- */}
      <div style={rowStyle}>
        {["sine", "triangle", "piano"].map((m) => (
          <button 
            key={m}
            className={`${playbackStyles.playbackButton} ${mode === m ? playbackStyles.active : playbackStyles.inactive}`}
            style={{...itemStyle, borderRadius: "8px"}}
            onClick={() => handleModeChange(m)}
            title={m}
          >
            {m === "sine" && <PiWaveSineBold size={24} />}
            {m === "triangle" && <PiWaveTriangleBold size={24} />}
            {m === "piano" && <MdOutlinePiano size={24} />}
          </button>
        ))}
      </div>

      {/* --- ROW 3: Tuning System --- */}
      <div style={rowStyle}>
        <span 
          className={`${playbackStyles.toggleButton} ${!settings.use12EDO ? playbackStyles.active : playbackStyles.inactive}`} 
          onClick={() => setUse12EDO(false)} 
          style={{...itemStyle, textAlign:"center", padding:"12px 0", borderRadius: "8px", cursor: "pointer"}}
        >
          JI
        </span>
        <span 
          className={`${playbackStyles.toggleButton} ${settings.use12EDO ? playbackStyles.active : playbackStyles.inactive}`} 
          onClick={() => setUse12EDO(true)} 
          style={{...itemStyle, textAlign:"center", padding:"12px 0", borderRadius: "8px", cursor: "pointer"}}
        >
          12-EDO
        </span>
      </div>

      {/* --- ROW 4: Visual Settings --- */}
      <div style={rowStyle}>
        {/* Double Sharps */}
        <button
          className={`${playbackStyles.playbackButton} ${settings.doubles ? playbackStyles.active : playbackStyles.inactive}`}
          style={itemStyle}
          onClick={() => setSettings(prev => ({ ...prev, doubles: !prev.doubles }))}
          title="Allow double sharps / flats"
        >
          <img src={settings.doubles ? doubleSharpsIcon : doubleSharpsInactive} style={{ width: "24px", height: "24px" }} alt="##" />
        </button>

        {/* Naturals */}
        <button
          className={`${playbackStyles.playbackButton} ${settings.naturals ? playbackStyles.active : playbackStyles.inactive}`}
          style={itemStyle}
          onClick={() => setSettings(prev => ({ ...prev, naturals: !prev.naturals }))}
          title="Show naturals"
        >
          <img src={settings.naturals ? showNaturalsIcon : hideNaturalsIcon} style={{ width: "24px", height: "24px" }} alt="Nat" />
        </button>

        {/* Colours */}
        <button
          className={`${playbackStyles.playbackButton} ${settings.colours ? playbackStyles.active : playbackStyles.inactive}`}
          style={itemStyle}
          onClick={() => setSettings(prev => ({ ...prev, colours: !prev.colours }))}
          title="Colours"
        >
          <img src={settings.colours ? showColoursIcon : hideColoursIcon} style={{ width: "24px", height: "24px" }} alt="Col" />
        </button>

        {/* Enharmonic Flip */}
        <button
          className={`${playbackStyles.playbackButton} ${settings.enharmonicToggle ? playbackStyles.active : playbackStyles.inactive}`}
          style={itemStyle}
          onClick={() => setSettings(prev => ({ ...prev, enharmonicToggle: prev.enharmonicToggle === 1 ? 0 : 1 }))}
          title="Enharmonic flip"
        >
          <img src={enharmonicsIcon} style={{ width: "24px", height: "24px" }} alt="Flip" />
        </button>
      </div>

      {/* --- ROW 5: Max Partials (Optional) --- */}
      {!hideMaxPartials && (
        <div style={{ ...rowStyle, justifyContent: "center", marginTop: "8px" }}>
            {/* Keeping this as a single centered block or you can flex it if you prefer */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Max partials:</span>
                {/* ... existing max partials controls ... */}
            </div>
        </div>
      )}
    </div>
  );
}