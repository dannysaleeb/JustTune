import React from "react";
import RadioButton from "./controls/RadioButton/RadioButton";
import StepperDial from "./controls/StepperDial/StepperDial";
import ToggleButton from "./controls/ToggleButton/ToggleButton";

import quarterSharp from "../icons/quartersharp.svg";
import quarterFlat from "../icons/quarterflat.svg";

import settingsStyles from "./styles/Settings.module.css";

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
      <div style={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center",
        gap: "20px", 
        width: "100%"
      }}>
        
        {/* Column 1: Tuning System */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={labelStyle}>System</span>
          <RadioButton
            // Map the boolean use12EDO back to the UI strings
            selected={settings.use12EDO ? "12EDO" : "JI"}
            options={["JI", "12EDO"]}
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

        {/* Column 2: Frequency */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={labelStyle}>A Hz</span>
          <StepperDial
            value={settings.tuningFrequency}
            min={415} max={450} step={1}
            onChange={(v) => setSetting("tuningFrequency", v)}
          />
        </div>

        {/* Column 3: Cents Offset */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={labelStyle}>Cents</span>
          <StepperDial
            value={settings.centDeviation}
            min={-50} max={50} step={1}
            onChange={handleDialChange}
          />
        </div>

        {/* Column 4: Quarter Tone Buttons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={labelStyle}>Shift</span>
          <div style={{ 
            display: "flex", 
            gap: "6px",
            minHeight: "var(--button-size)", 
            alignItems: "center" 
          }}>
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
        </div>

      </div>
    </div>
  );
}