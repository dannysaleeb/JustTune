import React, { useState, useEffect } from "react";
import { Fundamental } from "../classes/Partials.js";

// ! Let's set an octave limit here as global var, so we can easily change it 
// ! tbh max C3 - C4 for the keyboard is ok, otherwise partials are impractically high

export default function Piano({ onChange, setFlippedNotes }) {
  const WHITE_OFFSETS = [0, 2, 4, 5, 7, 9, 11, 12];
  const BLACK_OFFSETS = [1, 3, null, 6, 8, 10];

  const [fundamentalMidi, setFundamentalMidi] = useState(null); // ! is null better here, otherwise key is highlighted but fundamental not actually selected
  // ! Also, I find it weirdly disconcerting not being able to fully deselect the keyboard fundamental, even though it's pointless.
  const [viewOctave, setViewOctave] = useState(2);

  // Notify parent on mount about default fundamental
  // ! here's the fundamental auto-select -- come back to keep if necessary
  // useEffect(() => {
  //   onChange?.(new Fundamental(fundamentalMidi));
  // }, []);

  function selectFundamentalMidi(midi) {
    // Always set the fundamental, never deselect
    setFundamentalMidi(midi);
    onChange?.(new Fundamental(midi));
    setFlippedNotes(new Array(24).fill(false));
  }

  const handleOctaveChange = (delta) => {
    const nextOct = Math.min(8, Math.max(0, viewOctave + delta));
    setViewOctave(nextOct);

    if (fundamentalMidi !== null) {
      const shifted = fundamentalMidi + delta * 12;
      if (shifted >= 0 && shifted <= 127) selectFundamentalMidi(shifted);
    }
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
        <button
          onClick={() => handleOctaveChange(-1)}
          disabled={viewOctave <= 0}
          style={{ ...arrowButtonStyle, opacity: viewOctave <= 0 ? 0.2 : 1 }}
        >
          ‹
        </button>

        <div style={{ position: "relative", flex: 1, height: 100 }}>
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            {WHITE_OFFSETS.map((offset, i) => {
              const thisKeyOct = i === 7 ? viewOctave + 1 : viewOctave;
              const midi = (viewOctave + 1) * 12 + offset;
              const isSelected = midi === fundamentalMidi;

              return (
                <div
                  key={i}
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
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

                    userSelect: "none",
                    WebkitUserDrag: "none",
                    outline: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {(i === 0 || i === 7) ? `C${thisKeyOct}` : null}
                </div>
              );
            })}
          </div>

          {BLACK_OFFSETS.map((offset, i) => {
            if (offset === null) return null;
            const midi = (viewOctave + 1) * 12 + offset;
            const isSelected = midi === fundamentalMidi;

            return (
              <div
                key={i}
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
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

                  userSelect: "none",
                  WebkitUserDrag: "none",
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              />
            );
          })}
        </div>

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
