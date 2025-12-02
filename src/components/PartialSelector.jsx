import React, { useState, useEffect } from "react";

function PartialSelector({ maxPartials = 6, fundamental, onChange }) {
  const [selectedPartials, setSelectedPartials] = useState([]);

  // Update partials when fundamental changes
  useEffect(() => {
    if (!fundamental) {
      setSelectedPartials([]);
      return;
    }

    setSelectedPartials((prev) => {
      if (prev.length === 0) {
        // Only auto-select 1 if nothing is selected
        const firstPartial = fundamental.getPartial(1);
        return firstPartial ? [firstPartial] : [];
      } else {
        // Preserve existing selections, mapping to new fundamental
        return prev
          .map((p) => fundamental.getPartial(p.partialNumber))
          .filter(Boolean)
          .slice(0, maxPartials);
      }
    });
  }, [fundamental, maxPartials]);

  // Notify parent of selection changes
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
        newSelected.splice(existsIndex, 1);
      } else if (prev.length < maxPartials) {
        const partial = fundamental.getPartial(partialNumber);
        if (partial) newSelected.push(partial);
      }

      return newSelected.sort((a, b) => a.partialNumber - b.partialNumber);
    });
  };

  const selectedSet = new Set(selectedPartials.map((p) => p.partialNumber));
  const maxReached = selectedPartials.length >= maxPartials;
  const noFundamental = !fundamental;

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
        const disabled = noFundamental || (!isSelected && maxReached);

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
              backgroundColor: isSelected
                ? "#4CAF50"
                : disabled
                ? "#ccc"
                : "#eee",
              color: isSelected
                ? "white"
                : disabled
                ? "rgb(160,160,160)"
                : "black",
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
