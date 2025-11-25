import React, { useState } from "react";
import { Fundamental } from "../classes/Partials.js";

export default function Piano({ onChange }) {
  // White keys: offsets within an octave
  const WHITE_OFFSETS = [0, 2, 4, 5, 7, 9, 11, 12];
  const BLACK_OFFSETS = [1, 3, null, 6, 8, 10];

  const [fundamentalMidi, setFundamentalMidi] = useState(60); // C4 default
  const [viewOctave, setViewOctave] = useState(4);

  function selectFundamentalMidi(midi) {
    setFundamentalMidi(midi);
    onChange?.(new Fundamental(midi));
  }

  const handleOctaveChange = (delta) => {
    const nextOct = Math.min(8, Math.max(0, viewOctave + delta));
    setViewOctave(nextOct);

    const shifted = fundamentalMidi + delta * 12;
    if (shifted >= 0 && shifted <= 127) selectFundamentalMidi(shifted);
  };

  const arrowButtonStyle = {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "2.9rem",
    padding: "0 5px",
    color: "#333",
    userSelect: "none",
    flexShrink: 0,
    width: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={{ width: "100%", marginBottom: 20, userSelect: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {/* Left arrow */}
        <button
          onClick={() => handleOctaveChange(-1)}
          disabled={viewOctave <= 0}
          style={{ ...arrowButtonStyle, opacity: viewOctave <= 0 ? 0.2 : 1 }}
        >
          ‹
        </button>

        {/* Piano keys */}
        <div style={{ position: "relative", flex: 1, height: 100 }}>
          {/* White keys */}
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            {WHITE_OFFSETS.map((offset, i) => {
              const thisKeyOct = i === 7 ? viewOctave + 1 : viewOctave;
              const midi = (viewOctave + 1) * 12 + offset; // absolute shitshow with the top C octave but it works now
              const isSelected = midi === fundamentalMidi;

              return (
                <div
                  key={i}
                  onClick={() => selectFundamentalMidi(midi)}
                  style={{
                    flex: 1,
                    border: "1px solid #333",
                    borderRight: i === 7 ? "1px solid #333" : "none",
                    background: isSelected ? "#cce0ff" : "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingBottom: 6,
                    fontSize: "0.7rem",
                    color: "#555",
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                    transition: "background 0.15s ease",
                  }}
                >
                  {(i === 0 || i === 7) ? `C${thisKeyOct}` : null} {/* display the key name for both C's, could change to one / remove*/}
                </div>
              );
            })}
          </div>

          {/* Black keys */}
          {BLACK_OFFSETS.map((offset, i) => {
            if (offset === null) return null;
            const midi = (viewOctave + 1) * 12 + offset;
            const isSelected = midi === fundamentalMidi;

            return (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  selectFundamentalMidi(midi);
                }}
                style={{
                  position: "absolute",
                  left: `calc(${(i + 1) * 12.5}% - 3%)`,
                  top: 0,
                  width: "6%",
                  height: "60%",
                  maxWidth: 20,
                  minWidth: 6,
                  background: isSelected ? "#003f8a" : "black",
                  zIndex: 10,
                  cursor: "pointer",
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                  boxShadow: "1px 1px 3px rgba(0,0,0,0.3)",
                  transition: "background 0.15s ease",
                }}
              />
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => handleOctaveChange(1)}
          disabled={viewOctave >= 8}
          style={{ ...arrowButtonStyle, opacity: viewOctave >= 8 ? 0.2 : 1 }}
        >
          ›
        </button>
      </div>
    </div>
  );
}
