import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function FrequencyControl({ tuningFactor, setTuningFactor, disabled }) {
  const baseA4 = 440;
  const [customHz, setCustomHz] = useState(tuningFactor * baseA4);

  const applyHz = (value = customHz) => {
    
    if (disabled) return;

    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) return;

    setTuningFactor(numericValue / baseA4);
    setCustomHz(numericValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") applyHz();
  };

  const handleBlur = () => applyHz(); // if you click anywhere else it'll apply the new freq

  const increment = () => applyHz(customHz + 1);
  const decrement = () => applyHz(customHz - 1);

  // Shared button style
  const buttonStyle = {
    background: "transparent",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    padding: 0,
    outline: "none",
    boxShadow: "none",
    WebkitTapHighlightColor: "transparent", // remove blue square highlight
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
      
      {/* Up arrow */}
      <button
        onClick={increment}
        disabled={disabled}
        style={buttonStyle}
        tabIndex={-1} // prevents focus
        onMouseDown={(e) => e.preventDefault()} // stops blue focus highlight
      >
        <FaChevronUp size={16} color={disabled ? "#888" : "#000"} />
      </button>

      {/* Frequency input */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", fontWeight: 500 }}>
        <span style={{ fontSize: "18px" }}>A</span>
        <input
          type="number"
          value={customHz}
          onChange={(e) => setCustomHz(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={disabled}
          style={{
            fontSize: "18px",
            border: "none",
            outline: "none",
            textAlign: "center",
            background: "transparent",
            padding: 0,
            fontWeight: 500,
            minWidth: "3ch",
            width: `${String(customHz).length + 1}ch`,
          }}
        />
      </div>

      {/* Down arrow */}
      <button
        onClick={decrement}
        disabled={disabled}
        style={buttonStyle}
        tabIndex={-1} // prevents focus
        onMouseDown={(e) => e.preventDefault()} // stops blue focus highlight
      >
        <FaChevronDown size={16} color={disabled ? "#888" : "#000"} />
      </button>
    </div>
  );
}

// to do
// add react-icons to dependencies
// add reset button? 
// enforce bounds
