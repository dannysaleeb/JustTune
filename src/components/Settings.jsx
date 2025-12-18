// SETTINGS COMPONENT:
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
import playbackStyles from "./styles/playback.module.css";
import leftRightIcon from "../icons/left_right.svg";
import rightLeftIcon from "../icons/right_left.svg";

import flatIcon from "../icons/flat.svg";
import naturalIcon from "../icons/natural.svg";
import sharpIcon from "../icons/sharp.svg";

const enharmonicSymbols = [flatIcon, naturalIcon, sharpIcon];

export default function Settings({ 
  fundamental,
  settings, 
  setSettings, 
  hideMaxPartials = false,
  isPlaying, setIsPlaying,
  mode, setMode,
  tuningFactor, setTuningFactor
}) {

  // -- LAYOUT STYLES --
  const rowStyle = {
    display: "flex",
    width: "100%",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "space-between"
  };

  const itemStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 0,
  };

  const disabled = fundamental ? !fundamental.enharmonicOption : true;

  const enharmonicPair = fundamental
    ? [
        enharmonicSymbols[fundamental.enharmonicCurrent + 1],
        enharmonicSymbols[fundamental.enharmonicOther + 1],
      ]
    : [undefined, undefined];

  // Tone.js handlers
  const handleTogglePlay = async () => {
    await Tone.start();
    setIsPlaying(!isPlaying);
  };

  const handleModeChange = async (newMode) => {
    await Tone.start();
    setMode(newMode);
  };

  const setUse12EDO = (val) =>
    setSettings(p => ({ ...p, use12EDO: val }));
	
	console.log("DEBUG ENHARMONICS:", {
	  fundamentalObject: fundamental,
	  currentKey: fundamental?.midikey,
	  canFlip: fundamental?.enharmonicOption,
	  iconPath0: enharmonicPair[0],
	  toggleState: settings.enharmonicToggle
	});	
	
	console.log("PROPS CHECK:", { 
	  fundamentalExists: !!fundamental, 
	  midikey: fundamental?.midikey,
	  option: fundamental?.enharmonicOption 
	});	

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

      {/* --- ROW 1: Play / Frequency --- */}
      <div style={rowStyle}>
        <button
          className={`${playbackStyles.playbackButton} ${
            isPlaying ? playbackStyles.active : playbackStyles.inactive
          }`}
          style={{
            ...itemStyle,
            height: "auto",
            aspectRatio: "unset",
            borderRadius: "8px"
          }}
          onClick={handleTogglePlay}
        >
          {isPlaying
            ? <HiMiniSpeakerWave size={38} />
            : <HiMiniSpeakerXMark size={38} />}
        </button>

        <div
          style={{
            ...itemStyle,
            background: "#f5f5f5",
            borderRadius: "8px",
            padding: "4px"
          }}
        >
          <FrequencyControl
            tuningFactor={tuningFactor}
            setTuningFactor={setTuningFactor}
            disabled={false}
          />
        </div>
      </div>

      {/* --- ROW 2: Instrument --- */}
      <div style={rowStyle}>
        {["sine", "triangle", "piano"].map((m) => (
          <button
            key={m}
            className={`${playbackStyles.playbackButton} ${
              mode === m ? playbackStyles.active : playbackStyles.inactive
            }`}
            style={{ ...itemStyle, borderRadius: "8px" }}
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
          className={`${playbackStyles.toggleButton} ${
            !settings.use12EDO
              ? playbackStyles.active
              : playbackStyles.inactive
          }`}
          onClick={() => setUse12EDO(false)}
          style={{
            ...itemStyle,
            textAlign: "center",
            padding: "12px 0",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          JI
        </span>

        <span
          className={`${playbackStyles.toggleButton} ${
            settings.use12EDO
              ? playbackStyles.active
              : playbackStyles.inactive
          }`}
          onClick={() => setUse12EDO(true)}
          style={{
            ...itemStyle,
            textAlign: "center",
            padding: "12px 0",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          12-EDO
        </span>
      </div>

      {/* --- ROW 4: Visual Settings --- */}
      <div style={rowStyle}>
        <button
          className={`${playbackStyles.playbackButton} ${
            settings.doubles ? playbackStyles.active : playbackStyles.inactive
          }`}
          style={itemStyle}
          onClick={() =>
            setSettings(p => ({ ...p, doubles: !p.doubles }))
          }
          title="Allow double sharps / flats"
        >
          <img
            src={settings.doubles
              ? doubleSharpsIcon
              : doubleSharpsInactive}
            style={{ width: "24px", height: "24px" }}
            alt="##"
          />
        </button>

        <button
          className={`${playbackStyles.playbackButton} ${
            settings.naturals ? playbackStyles.active : playbackStyles.inactive
          }`}
          style={itemStyle}
          onClick={() =>
            setSettings(p => ({ ...p, naturals: !p.naturals }))
          }
          title="Show naturals"
        >
          <img
            src={settings.naturals
              ? showNaturalsIcon
              : hideNaturalsIcon}
            style={{ width: "24px", height: "24px" }}
            alt="Nat"
          />
        </button>

        <button
          className={`${playbackStyles.playbackButton} ${
            settings.colours ? playbackStyles.active : playbackStyles.inactive
          }`}
          style={itemStyle}
          onClick={() =>
            setSettings(p => ({ ...p, colours: !p.colours }))
          }
          title="Colours"
        >
          <img
            src={settings.colours
              ? showColoursIcon
              : hideColoursIcon}
            style={{ width: "24px", height: "24px" }}
            alt="Col"
          />
        </button>
      </div>

	{/* --- ROW 5: Enharmonic Flip (FINAL ROW) --- */}
	<div
	  className={playbackStyles.row}
	  style={{ gap: "4px", marginBottom: "20px" }}
	>
	  {/** Compute disabled inside click handler, not at render */}
	  <button
		className={`${playbackStyles.toggleButton} ${
		  settings.enharmonicToggle === 0
			? playbackStyles.active
			: playbackStyles.inactive
		}`}
		style={{ width: "90px", height: "50px", padding: "5px 12px" }}
		onClick={() => {
		  if (!fundamental?.enharmonicOption) return; // compute now
		  setSettings(p => ({ ...p, enharmonicToggle: 0 }));
		}}
		title="Enharmonic flip"
	  >
		{fundamental?.enharmonicOption && enharmonicSymbols[fundamental.enharmonicCurrent + 1] && (
		  <img
			src={enharmonicSymbols[fundamental.enharmonicCurrent + 1]}
			style={{ width: "36px", height: "36px" }}
			alt=""
			className={playbackStyles.icon}
		  />
		)}
	  </button>

	  <div
		style={{
		  display: "flex",
		  alignItems: "center",
		  justifyContent: "center",
		  width: "40px",
		  opacity: fundamental?.enharmonicOption ? 1 : 0.4
		}}
	  >
		<img
		  src={
			settings.enharmonicToggle === 0
			  ? leftRightIcon
			  : rightLeftIcon
		  }
		  style={{ width: "36px", height: "36px" }}
		  alt=""
		  className={playbackStyles.icon}
		/>
	  </div>

	  <button
		className={`${playbackStyles.toggleButton} ${
		  settings.enharmonicToggle === 1
			? playbackStyles.active
			: playbackStyles.inactive
		}`}
		style={{ width: "90px", height: "50px", padding: "5px 12px" }}
		onClick={() => {
		  if (!fundamental?.enharmonicOption) return; // compute now
		  setSettings(p => ({ ...p, enharmonicToggle: 1 }));
		}}
		title="Enharmonic flip"
	  >
		{fundamental?.enharmonicOption && enharmonicSymbols[fundamental.enharmonicOther + 1] && (
		  <img
			src={enharmonicSymbols[fundamental.enharmonicOther + 1]}
			style={{ width: "36px", height: "36px" }}
			alt=""
			className={playbackStyles.icon}
		  />
		)}
	  </button>
	</div>

      {/* --- ROW 6: Max Partials (Optional) --- */}
      {!hideMaxPartials && (
        <div style={{ ...rowStyle, justifyContent: "center", marginTop: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Max partials:</span>
            {/* existing controls */}
          </div>
        </div>
      )}
    </div>
  );
}
