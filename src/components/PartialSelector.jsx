// this seems to work

import React, { useState, useEffect } from "react";

// max partials 6 at the minute
function PartialSelector({ maxPartials = 6, fundamental, onChange }) {
  const [selectedPartials, setSelectedPartials] = useState([]);

  // update partials if the fundamental changes
  useEffect(() => {
    if (!fundamental) return;

    setSelectedPartials((prev) =>
      prev
        .map((p) => fundamental.getPartial(p.partialNumber))
        .sort((a, b) => a.partialNumber - b.partialNumber) // sorting by partial number
    );
  }, [fundamental]);

  // Notify parent when selectedPartials changes
  useEffect(() => {
    onChange?.(
      [...selectedPartials].sort((a, b) => a.partialNumber - b.partialNumber)
    );
  }, [selectedPartials, onChange]);

  const toggle = (partialNumber) => {
    if (!fundamental) return;

    setSelectedPartials((prev) => {
      const existsIndex = prev.findIndex((p) => p.partialNumber === partialNumber);
      let newSelected = [...prev];

      if (existsIndex !== -1) {
        // Deselect
        newSelected.splice(existsIndex, 1);
      } else if (prev.length < maxPartials) {
        // Select only if under max 6
        newSelected.push(fundamental.getPartial(partialNumber));
      }

      // sort results by partialNumber, I suppose this is how we'll notate?
      return newSelected.sort((a, b) => a.partialNumber - b.partialNumber);
    });
  };

  const selectedSet = new Set(selectedPartials.map((p) => p.partialNumber));
  const maxReached = selectedPartials.length >= maxPartials;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gap: "6px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => {
        const isSelected = selectedSet.has(num);
        const disabled = !isSelected && maxReached; // disabling clicking on the grid if max selected (better?)

        return (
          <div
            key={num}
            onClick={() => !disabled && toggle(num)}
            style={{
              aspectRatio: "1",
              minWidth: "30px",
              maxWidth: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: disabled ? "not-allowed" : "pointer",
              borderRadius: "4px",
              userSelect: "none",
              WebkitTapHighlightColor: "transparent",
              backgroundColor: isSelected ? "#4CAF50" : disabled ? "#ccc" : "#eee",
              color: isSelected ? "white" : disabled ? "rgb(160,160,160)" : "black",
              border: "1px solid #ccc",
              fontSize: "14px",
              boxSizing: "border-box",
              transition: "background-color 0.15s ease",
            }}
          >
            {num}
          </div>
        );
      })}
    </div>
  );
}

export default PartialSelector;

