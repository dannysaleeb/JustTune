import { useEffect, useState } from "react";
import PartialButton from "../controls/PartialButton";
import { KEY_TO_PARTIAL } from "../../config";
import styles from "./main_styles/PartialSelector.module.css";

function PartialSelector({
  fundamental,
  partialNumbers,
  setPartialNumbers,
  settings,
  colours
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragModeIsRemoving, setDragModeIsRemoving] = useState(false);

  function getColour(partialNumber) {
    let colourIndex = 0;

    // reduce to odd
    if (partialNumber % 2 === 0) {
      while (Number.isInteger(partialNumber / 2)) {
        partialNumber /= 2;
      }
    }

    for (let i = 0; i < partialNumber; i++) {
      if (i % 2 !== 0) colourIndex++;
    }

    return colours[colourIndex];
  }

  // Update partialNumbers when fundamental changes
  useEffect(() => {
    if (!fundamental) {
      setPartialNumbers([]);
      return;
    }

    setPartialNumbers(prev =>
      prev.filter(n => n > 0 && n <= 24).slice(0, settings.maxPartials)
    );
  }, [fundamental, settings.maxPartials, setPartialNumbers]);

  // Stop drag on mouse up anywhere
  useEffect(() => {
    const stopDrag = () => setIsDragging(false);
    window.addEventListener("mouseup", stopDrag);
    return () => window.removeEventListener("mouseup", stopDrag);
  }, []);

  // Keyboard handling
  useEffect(() => {
    function handleKeyDown(e) {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA"
      ) return;

      const key = e.key.toLowerCase();
      const num = KEY_TO_PARTIAL[key];

      if (!num || !fundamental) return;

      const isSelected = partialNumbers.includes(num);
      const maxReached = partialNumbers.length >= settings.maxPartials;

      if (!isSelected && maxReached) return;

      e.preventDefault();

      setPartialNumbers(prev => {
        if (prev.includes(num)) {
          return prev.filter(n => n !== num);
        }
        return [...prev, num].sort((a, b) => a - b);
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fundamental, partialNumbers, settings.maxPartials, setPartialNumbers]);

  const selectedSet = new Set(partialNumbers);
  const maxReached = partialNumbers.length >= settings.maxPartials;

  return (
    <div className={styles.partialSelectorGrid}>
      {Array.from({ length: 24 }, (_, i) => i + 1).map(num => {
        const isSelected = selectedSet.has(num);
        const disabled = !fundamental || (!isSelected && maxReached);

        return (
          <PartialButton
            key={num}
            number={num}
            selected={isSelected}
            disabled={disabled}
            style={{ "--partial-color": getColour(num) }}

            onMouseDown={e => {
              if (disabled || e.button !== 0) return;
              e.preventDefault();

              setIsDragging(true);
              setDragModeIsRemoving(isSelected);

              setPartialNumbers(prev => {
                if (prev.includes(num)) {
                  return prev.filter(n => n !== num);
                }
                if (prev.length < settings.maxPartials) {
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
                }

                return exists || prev.length >= settings.maxPartials
                  ? prev
                  : [...prev, num].sort((a, b) => a - b);
              });
            }}

            onMouseUp={() => setIsDragging(false)}
          />
        );
      })}
    </div>
  );
}

export default PartialSelector;
