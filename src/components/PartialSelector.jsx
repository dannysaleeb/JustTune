import { useEffect, useState } from "react";
import PartialButton from "./PartialButton";

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



          <PartialButton
            key={num}
            number={num}
            selected={isSelected}
            disabled={disabled}

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
          />
        );
      })}
    </div>
  );
}

export default PartialSelector;
