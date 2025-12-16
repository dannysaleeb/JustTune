import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const frequencyBoxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "100%",
  height: "100%",
  minHeight: "80px",
  borderRadius: "8px",

  background: "white",
  border: "2px solid black",
  boxShadow: `
    inset 2px 2px 4px rgba(0,0,0,0.35),
    inset -2px -2px 4px rgba(255,255,255,0.3)
  `,
};

export default function FrequencyControl({ tuningFactor, setTuningFactor, disabled, style }) {
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
    MozAppearance: "textfield", // Firefox
    WebkitAppearance: "none",   // Chrome, Safari, Edge
    margin: 0,
  };

  return (
    <div style={{ ...frequencyBoxStyle, ...style }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        {/* Up arrow */}
        <button
          onClick={increment}
          disabled={isUpDisabled || disabled}
          style={buttonStyle}
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
        >
          <FaChevronUp size={20} color={isUpDisabled ? "#888" : "#000"} />
        </button>

        {/* A + frequency */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <span
            style={{
              fontSize: "20px",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontWeight: 600,
            }}
          >
            A
          </span>
          <input
            type="number"
            value={customHz}
            onChange={(e) => setCustomHz(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            min={MIN_HZ}
            max={MAX_HZ}
            style={{
              ...inputStyle,
              fontSize: "20px",
              width: "4ch",
            }}
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
          <FaChevronDown size={20} color={isDownDisabled ? "#888" : "#000"} />
        </button>
      </div>

      {/* Hide number input spinners */}
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