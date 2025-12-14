import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import doubleSharpsIcon from "../icons/doublesharps.svg";
import doubleSharpsInactive from "../icons/doublesharps_inactive.svg";
import showNaturalsIcon from "../icons/shownaturals.svg";
import hideNaturalsIcon from "../icons/hidenaturals.svg";
import showColoursIcon from "../icons/showcolours.svg";
import hideColoursIcon from "../icons/hidecolours.svg";
import enharmonicsIcon from "../icons/enharmonics.svg";
import playbackStyles from "./styles/playback.module.css";

export default function Settings({ settings, setSettings }) {
  const buttonStyle = {
    background: "transparent",
    border: "none",
    padding: 0,
    outline: "none",
    boxShadow: "none",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
  };

  const inputStyle = {
    fontSize: "18px",
    border: "none",
    outline: "none",
    textAlign: "center",
    background: "transparent",
    padding: "0 4px",
    fontWeight: 500,
    minWidth: "3ch",
    width: "3ch",
    MozAppearance: "textfield",
    WebkitAppearance: "none",
    margin: 0,
  };

  const MAX_PARTIALS = 12;
  const MIN_PARTIALS = 6;

  return (
    <div>
      {/* --- Button row --- */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        {/* Double sharps / flats */}
        <button
          className={`${playbackStyles.playbackButton} ${
            settings.doubles ? playbackStyles.active : playbackStyles.inactive
          }`}
          onClick={() =>
            setSettings(prev => ({ ...prev, doubles: !prev.doubles }))
          }
          title="Allow double sharps / flats"
        >
          <img
            src={settings.doubles ? doubleSharpsIcon : doubleSharpsInactive}
            style={{ width: "30px", height: "30px" }}
            alt=""
            className={playbackStyles.icon}
          />
        </button>

        {/* Naturals */}
        <button
          className={`${playbackStyles.playbackButton} ${
            settings.naturals ? playbackStyles.active : playbackStyles.inactive
          }`}
          onClick={() =>
            setSettings(prev => ({ ...prev, naturals: !prev.naturals }))
          }
          title="Show naturals"
        >
          <img
            src={settings.naturals ? showNaturalsIcon : hideNaturalsIcon}
            style={{ width: "30px", height: "30px" }}
            alt=""
            className={playbackStyles.icon}
          />
        </button>

        {/* Colours */}
        <button
          className={`${playbackStyles.playbackButton} ${
            settings.colours ? playbackStyles.active : playbackStyles.inactive
          }`}
          onClick={() =>
            setSettings(prev => ({ ...prev, colours: !prev.colours }))
          }
          title="Colours"
        >
          <img
            src={settings.colours ? showColoursIcon : hideColoursIcon}
            style={{ width: "30px", height: "30px" }}
            alt=""
            className={playbackStyles.icon}
          />
        </button>

        {/* Enharmonic flip */}
        <button
          className={`${playbackStyles.playbackButton} ${
            settings.enharmonicToggle
              ? playbackStyles.active
              : playbackStyles.inactive
          }`}
          onClick={() =>
            setSettings(prev => ({
              ...prev,
              enharmonicToggle:
                prev.enharmonicToggle === 1 ? 0 : 1
            }))
          }
          title="Enharmonic flip"
        >
          <img
            src={enharmonicsIcon}
            style={{ width: "30px", height: "30px" }}
            alt=""
            className={playbackStyles.icon}
          />
        </button>
      </div>

      {/* Max partials (FrequencyControl style) */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", fontWeight: 500, fontFamily: "Arial, sans-serif" }}>
        <span style={{ fontSize: "18px", fontFamily: "inherit" }}>Max partials :</span>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          {/* Up arrow */}
          <button
            onClick={() =>
              setSettings(prev => ({
                ...prev,
                maxPartials: Math.min(prev.maxPartials + 1, MAX_PARTIALS)
              }))
            }
            style={buttonStyle}
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
          >
            <FaChevronUp size={16} color={settings.maxPartials >= MAX_PARTIALS ? "#888" : "#000"} />
          </button>

          {/* Number input */}
          <input
            type="number"
            value={settings.maxPartials}
            onChange={e =>
              setSettings(prev => ({
                ...prev,
                maxPartials: Math.min(Math.max(Number(e.target.value), MIN_PARTIALS), MAX_PARTIALS)
              }))
            }
            style={inputStyle}
            min={MIN_PARTIALS}
            max={MAX_PARTIALS}
          />

          {/* Down arrow */}
          <button
            onClick={() =>
              setSettings(prev => ({
                ...prev,
                maxPartials: Math.max(prev.maxPartials - 1, MIN_PARTIALS)
              }))
            }
            style={buttonStyle}
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
          >
            <FaChevronDown size={16} color={settings.maxPartials <= MIN_PARTIALS ? "#888" : "#000"} />
          </button>
        </div>
      </div>
    </div>
  );
}
