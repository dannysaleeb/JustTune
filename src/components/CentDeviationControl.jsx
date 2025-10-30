import React from "react";

// input cent deviation (could use this for other tunings too? or keep separate instead?)

function CentDeviationControl({ centDeviation, onChange }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label>
        Cent deviation:
        <input
          type="number"
          value={centDeviation}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            marginLeft: "5px",
            padding: "4px 8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "80px",
          }}
        />
        <span style={{ marginLeft: "5px" }}>cents</span>
      </label>
    </div>
  );
}

export default CentDeviationControl;