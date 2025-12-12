import { useEffect, useState } from "react";
import PartialButton from "./PartialButton";

function PartialSelector({ fundamental, partialNumbers, setPartialNumbers, settings, colours }) {

  const [isDragging, setIsDragging] = useState(false);
  const [dragModeIsRemoving, setDragModeIsRemoving] = useState(false);

  function getColour(partialNumber) {
    let colourIndex = 0;
    
    // if not prime, divide by 2 until prime
    if (partialNumber % 2 === 0) {
        while (Number.isInteger(partialNumber / 2)) {
            partialNumber /= 2
        }
    };

    for (let i = 0; i < partialNumber; i++) {
        if (!(i % 2 === 0)) { colourIndex++ } 
    }

    return colours[colourIndex]
  };

  // Update partialNumbers when fundamental changes
  useEffect(() => {
    if (!fundamental) {
      setPartialNumbers([]);
      return;
    } else {
      setPartialNumbers(
        prev => prev.filter(n => n > 0 && n <= 24).slice(0, settings.maxPartials)
      )
    }
  }, [fundamental, settings.maxPartials, setPartialNumbers]);

  useEffect(() => {
    const stopDrag = () => setIsDragging(false);
    window.addEventListener("mouseup", stopDrag);
    return () => window.removeEventListener("mouseup", stopDrag);
  }, []);

  const selectedSet = new Set(partialNumbers);
  const maxReached = partialNumbers.length >= settings.maxPartials;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 47px)",
        gridTemplateRows: "repeat(3, 47px)",
        margin: "0 auto",
        gap: "6px",
        width: "fit-content",
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
            style={{
              "--partial-color": getColour(num)
            }}
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
                } else if (prev.length < settings.maxPartials) {
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
                  return exists || prev.length >= settings.maxPartials
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
