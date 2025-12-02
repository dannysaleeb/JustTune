import { useState, useEffect } from "react";
import Piano from "./components/Piano";
import PartialSelector from "./components/PartialSelector";
import Notation from "./components/Notation";
import Playback from "./components/Playback";
import FrequencyControl from "./components/FrequencyControl";
import { Fundamental } from "./classes/Partials.js"; 

function App() {
  // Initialize default fundamental to C4
  const [fundamental, setFundamental] = useState(new Fundamental(60)); // MIDI 60 = C4
  const [partials, setPartials] = useState([]);
  const [maxPartials, setMaxPartials] = useState(8); // ! could up this to 8, and/or allow control in settings
  const [note, setNote] = useState("C4");

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
      setNote(`${fundamental.name}${fundamental.octave}`);
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
      <FrequencyControl
        fundamental={fundamental}
        onChange={setFundamental}
      />

      <Notation 
        partials={partials}
        maxPartials={maxPartials}
      />

      <PartialSelector
        fundamental={fundamental}
        maxPartials={maxPartials}
        onChange={setPartials}
      />

      <Playback partials={partials} />

      <Piano
        onChange={(f) => {
          setFundamental(f);
          if (f) {
            setNote(`${f.name}${f.octave}`);
          }
        }}
      />
    </div>
  );
}

export default App;
