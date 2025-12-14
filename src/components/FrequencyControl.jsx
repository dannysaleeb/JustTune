import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function FrequencyControl({ tuningFactor, setTuningFactor, disabled }) {
  const baseA4 = 440;
  const MIN_HZ = 415;
  const MAX_HZ = 450;
  
  const [customHz, setCustomHz] = useState(tuningFactor * baseA4);

  const applyHz = (value = customHz) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    let restrictedValue = Math.min(Math.max(numericValue, MIN_HZ), MAX_HZ);

    setTuningFactor(restrictedValue / baseA4);
    setCustomHz(restrictedValue); 
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") applyHz();
  };

  const handleBlur = () => applyHz(); 

  const increment = () => {
    if (customHz < MAX_HZ) applyHz(customHz + 1);
  };
  
  const decrement = () => {
    if (customHz > MIN_HZ) applyHz(customHz - 1);
  };

  const buttonStyle = {
    background: "transparent",
    border: "none",
    padding: 0,
    outline: "none",
    boxShadow: "none",
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
  };
  
  const isUpDisabled = customHz >= MAX_HZ;
  const isDownDisabled = customHz <= MIN_HZ;

  const inputStyle = {
    fontSize: "18px",
    border: "none",
    outline: "none",
    textAlign: "center",
    background: "transparent",
    padding: 0,
    fontWeight: 500,
    minWidth: "5ch",
    width: "5ch",
    // Hide spin buttons
    MozAppearance: "textfield", // Firefox
    WebkitAppearance: "none",   // Chrome, Safari, Edge
    margin: 0,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
      
      {/* Up arrow */}
      <button
        onClick={increment}
        disabled={isUpDisabled || disabled} 
        style={buttonStyle}
        tabIndex={-1} 
        onMouseDown={(e) => e.preventDefault()} 
      >
        <FaChevronUp size={16} color={isUpDisabled ? "#888" : "#000"} />
      </button>

      {/* Frequency input */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", fontWeight: 500 }}>
        <span style={{ fontSize: "18px", fontFamily: "Arial, Helvetica, sans-serif" }}>A</span>
        <input
          type="number"
          value={customHz}
          onChange={(e) => setCustomHz(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          min={MIN_HZ} 
          max={MAX_HZ}
          style={inputStyle}
          disabled={disabled}
        />
      </div>

      {/* Down arrow */}
      <button
        onClick={decrement}
        disabled={isDownDisabled || disabled} 
        style={buttonStyle}
        tabIndex={-1} 
        onMouseDown={(e) => e.preventDefault()} 
      >
        <FaChevronDown size={16} color={isDownDisabled ? "#888" : "#000"} />
      </button>

      {/* Extra CSS to hide arrows in Chrome/Safari */}
      <style>
        {`
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}
      </style>
    </div>
  );
}
