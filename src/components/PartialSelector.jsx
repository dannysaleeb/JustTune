import React, { useState } from "react";

// for choosing the partials

function PartialSelector({ partials, onChange }) {
  // Store local input as a string
  const [inputValue, setInputValue] = useState(partials.join(","));

  const handleSetPartials = () => {
    // Split input by commas, trim spaces, convert to numbers
    const parsed = inputValue
      .split(",")
      .map((p) => parseInt(p.trim(), 10))
      .filter((p) => !isNaN(p) && p > 0); // keep only positive numbers

    if (parsed.length > 0) {
      onChange(parsed);
    }
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <label>
        Partials: (comma separated)
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. 1,2,3"
          style={{
            marginLeft: "5px",
            padding: "4px 8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "120px",
          }}
        />
      </label>
      <button
        onClick={handleSetPartials}
        style={{
          marginLeft: "10px",
          padding: "4px 8px",
          fontSize: "14px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Set Partials
      </button>
    </div>
  );
}

export default PartialSelector;