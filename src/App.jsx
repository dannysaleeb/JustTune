import { useState, useEffect } from "react";
import Piano from "./components/Piano";
import PartialSelector from "./components/PartialSelector";
import Notation from "./components/Notation";
import Playback from "./components/Playback";

function App() {
  const [fundamental, setFundamental] = useState(null);
  const [partials, setPartials] = useState([]);
  const [note, setNote] = useState("C4");
  const [results, setResults] = useState([]);

  // Debug logging for fundamental
  useEffect(() => {
    if (fundamental) {
      console.log("Current Fundamental:", {
        frequency: fundamental.frequency,
        octave: fundamental.octave,
        name: fundamental.name,
        degree: fundamental.degree,
        key: fundamental.key,
      });
    }
  }, [fundamental]);

  // Debug logging for partials
  useEffect(() => {
    if (partials.length > 0) {
      console.log(
        "Selected Partials:",
        partials.map((p) => ({
          partialNumber: p.partialNumber,
          frequency: p.frequency,
          note: p.note,
        }))
      );
    }
  }, [partials]);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "25px",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* Placeholder Frequency adjustments: to do */}

      {/* Placeholder notation: removed from app as printing everything anyway */}

      {/* Continuous playback: this will now hear the adjusted frequency */}
      <Playback note={note} partials={partials} />

      {/* Partial selector */}
      <PartialSelector
        fundamental={fundamental}
        maxPartials={6}
        onChange={setPartials}
      />

      {/* Piano selects a new Fundamental */}
      <Piano
        onChange={(f) => {
          setFundamental(f);
          setNote(`${f.name}${f.octave}`);
        }}
      />
    </div>
  );
}

export default App;
