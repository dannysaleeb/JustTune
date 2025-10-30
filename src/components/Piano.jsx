import React, { useState } from "react";

// this is not a piano

function Piano({ note, onChange }) {
  const [inputValue, setInputValue] = useState(note);

  const handleSetNote = () => {
    onChange(inputValue);
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <label>
        Note:
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. C4 or G#3"
          style={{
            marginLeft: "5px",
            padding: "4px 8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "80px",
          }}
        />
      </label>
      <button
        onClick={handleSetNote}
        style={{
          marginLeft: "10px",
          padding: "4px 8px",
          fontSize: "14px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Set Note
      </button>
    </div>
  );
}

export default Piano;