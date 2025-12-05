import { useEffect, useState } from "react";

function PartialSelector({ fundamental, maxPartials, partialNumbers, setPartialNumbers }) {

  const [isDragging, setIsDragging] = useState(false);
  const [dragModeIsRemoving, setDragModeIsRemoving] = useState(false);

  // Update partialNumbers when fundamental changes
  useEffect(() => {
    if (!fundamental) {
      setPartialNumbers([]);
      return;
    } else {
      setPartialNumbers(
        prev => prev.filter(n => n > 0 && n <= 24).slice(0, maxPartials)
      )
    }
  }, [fundamental, maxPartials, setPartialNumbers]);

  useEffect(() => {
    const stopDrag = () => setIsDragging(false);
    window.addEventListener("mouseup", stopDrag);
    return () => window.removeEventListener("mouseup", stopDrag);
  }, []);

  const toggle = (partialNumber) => {
    if (!fundamental) return;

    setPartialNumbers(prev => {
      
      const exists = prev.includes(partialNumber);

      if (exists) { return prev.filter(n => n !== partialNumber );}

      if (prev.length >= maxPartials) {
        return prev;
      }

      return [...prev, partialNumber].sort((a, b) => a - b)
    });
  };

  const selectedSet = new Set(partialNumbers);
  const maxReached = partialNumbers.length >= maxPartials;

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
        const disabled = !fundamental || (!isSelected && maxReached);

        return (
          <div
            key={num}
            onMouseDown={(e) => {
              if (disabled) return;
              if (e.button !== 0) return;
              e.preventDefault();

              setIsDragging(true);
              setDragModeIsRemoving(partialNumbers.includes(num));

              setPartialNumbers(prev => {
                const exists = prev.includes(num);

                if (exists) {
                  return prev.filter(n => n !== num);
                } else if (prev.length < maxPartials) {
                  return [...prev, num].sort((a, b) => a - b);
                }
                return prev;
              });
            }}
            onMouseEnter={() => {
              if (!isDragging || disabled) return;

              setPartialNumbers(prev => {
                const exists = prev.includes(num);

                if (dragModeIsRemoving) {
                  return exists ? prev.filter(n => n !== num) : prev;
                } else {
                  return exists || prev.length >= maxPartials
                    ? prev
                    : [...prev, num].sort((a, b) => a - b);
                }
              });
            }}
            onMouseUp={() => {
              setIsDragging(false);
            }}
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
