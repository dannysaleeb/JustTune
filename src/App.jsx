import { useState, useEffect } from "react";
import Piano from "./components/Piano";
import PartialSelector from "./components/PartialSelector";
import Notation from "./components/Notation";
import Playback from "./components/Playback";
import FrequencyControl from "./components/FrequencyControl";

function App() {
  const [fundamental, setFundamental] = useState(null);
  const [partials, setPartials] = useState([]);
  const [note, setNote] = useState(null);   // was "C4" — now correct for no selection
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
    } else {
      console.log("Fundamental cleared");
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
    } else {
      console.log("No partials selected");
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
      {/* Frequency adjustments */}
      <FrequencyControl
        fundamental={fundamental}
        onChange={setFundamental}
      />
	  
	  {/* Placeholder for notation */}

      {/* Partial selector */}
      <PartialSelector
        fundamental={fundamental}
        maxPartials={6}
        onChange={setPartials}
      />
	  
	  {/* Audio Playback */}
	  <Playback partials={partials} />

      {/* Piano selects (or clears) the fundamental */}
      <Piano
        onChange={(f) => {
          setFundamental(f);
          if (f) {
            setNote(`${f.name}${f.octave}`);
          } else {
            setNote(null);
          }
        }}
      />
    </div>
  );
}

export default App;

// notes:
// having no fundamental selected seems a bit more intuitive but happy to change back
// load all elements, but grey them on startup (and if no fundamental selected)
// marginally better playback added, but lots to do here