import React from "react";
import RadioButton from "../../controls/RadioButton";
import StepperDial from "../../controls/StepperDial";
import ToggleButton from "../../controls/ToggleButton";

import quarterSharp from "../../../assets/icons/quartersharp.svg";
import quarterFlat from "../../../assets/icons/quarterflat.svg";

import settingsStyles from "../settings_styles/Settings.module.css";

export default function TuningSettings({ settings, setSetting }) {
  const isPlus50 = settings.centDeviation === 50;
  const isMinus50 = settings.centDeviation === -50;

  const handleDialChange = (v) => {
    const clamped = Math.max(-50, Math.min(50, v));
    setSetting("centDeviation", clamped);
  };

  const handleToggle = (value) => {
    setSetting("centDeviation", value);
  };

  // Label style to keep all headers aligned
  const labelStyle = { 
    fontFamily: '"Amatica SC"', 
    fontWeight: 700, 
    fontSize: "1rem", 
    lineHeight: "1",
    marginBottom: "8px",
    textAlign: "center"
  };

  return (
    <div className={settingsStyles.settingsItemContainer}>
      {/* Column 2: Frequency */}
      <div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <StepperDial
            value={settings.tuningFrequency}
            min={415} max={450} step={1}
            onChange={(v) => setSetting("tuningFrequency", v)}
          />
        </div>
        <div style={{ fontSize: "var(--control-label-font-size" }}>A frequency (Hz)</div>
      </div>


      {/* Column 3: Cents Offset -- REMOVED FOR EASE ... */}
      {/* <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <StepperDial
          value={settings.centDeviation}
          min={-50} max={50} step={1}
          onChange={handleDialChange}
        />
      </div> */}

      {/* Column 4: Quarter Tone Buttons */}
      <div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "var(--control-gap)" }}>
          <ToggleButton
            value={isMinus50}
            onChange={() => handleToggle(isMinus50 ? 0 : -50)}
            title="Quarter Flat (-50¢)"
          >
            <img src={quarterFlat} alt="b" style={{ height: "65%", width: "auto" }} />
          </ToggleButton>
          
          <ToggleButton
            value={isPlus50}
            onChange={() => handleToggle(isPlus50 ? 0 : 50)}
            title="Quarter Sharp (+50¢)"
          >
            <img src={quarterSharp} alt="#" style={{ height: "65%", width: "auto" }} />
          </ToggleButton>
        </div>
        <div style={{ fontSize: "var(--control-label-font-size" }}>+/- 50c</div>
      </div>
    </div>
  );
}
