import { useState } from "react";
import styles from "./main_styles/Piano.module.css";
import { DEFAULT_ENHARMONICS } from "../../config";

export default function Piano({ midiKey, setMidiKey, setFlippedNotes, playTrigger, setPlayTrigger, setSetting }) {
  const WHITE_OFFSETS = [0, 2, 4, 5, 7, 9, 11, 12];
  const BLACK_KEYS = [
    { offset: 1, left: "12.5%" },
    { offset: 3, left: "25%" },
    { offset: 6, left: "50%" },
    { offset: 8, left: "62.5%" },
    { offset: 10, left: "75.5%" },
  ];

  const [viewOctave, setViewOctave] = useState(2);

  function selectFundamentalMidi(midi) {
    const pitchClass = midi % 12;

    if (DEFAULT_ENHARMONICS[pitchClass] !== undefined) {
      setSetting("enharmonicToggle", DEFAULT_ENHARMONICS[pitchClass])
    } else {
      setSetting("enharmonicToggle", 0);
    }

    if (midi === midiKey) {
      setPlayTrigger(playTrigger + 1)
    };

    setFlippedNotes(new Array(24).fill(false));
    setMidiKey(midi);
  }

  const handleOctaveChange = (delta) => {
    const nextOct = Math.min(3, Math.max(0, viewOctave + delta));
    setViewOctave(nextOct);

    if (midiKey !== null) {
      const shifted = midiKey + delta * 12;
      if (shifted >= 0 && shifted <= 127) {
        selectFundamentalMidi(shifted);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.arrow}
        /* MANUAL CHECK: Only run if not at the boundary */
        onPointerDown={(e) => {
            e.preventDefault();
            if (viewOctave > 0) {
                handleOctaveChange(-1);
            }
        }}
        disabled={viewOctave <= 0}
      >
        ‹
      </button>

      <div className={styles.keyboard}>
        <div className={styles.whiteKeys}>
          {WHITE_OFFSETS.map((offset, i) => {
            const thisKeyOct = i === 7 ? viewOctave + 1 : viewOctave;
            const midi = (viewOctave + 1) * 12 + offset;
            const isSelected = midi === midiKey;

            return (
              <div
                key={i}
                className={`${styles.whiteKey} ${isSelected ? styles.whiteSelected : ""}`}
                onPointerDown={(e) => {
                    e.preventDefault();
                    selectFundamentalMidi(midi);
                }}
              >
                {(i === 0 || i === 7) ? `C${thisKeyOct}` : null}
              </div>
            );
          })}
        </div>

        {BLACK_KEYS.map((key, i) => {
          const midi = (viewOctave + 1) * 12 + key.offset;
          const isSelected = midi === midiKey;

          return (
            <div
              key={i}
              className={`${styles.blackKey} ${isSelected ? styles.blackSelected : ""}`}
              style={{ left: key.left }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                selectFundamentalMidi(midi);
              }}
            />
          );
        })}
      </div>

      <button
        className={styles.arrow}
        onPointerDown={(e) => {
            e.preventDefault();
            if (viewOctave < 3) {
                handleOctaveChange(1);
            }
        }}
        disabled={viewOctave >= 3}
      >
        ›
      </button>
    </div>
  );
}
