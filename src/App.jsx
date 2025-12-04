import { useState, useMemo } from "react";
import Piano from "./components/Piano";
import PartialSelector from "./components/PartialSelector";
import Notation from "./components/Notation";
import Playback from "./components/Playback";
import FrequencyControl from "./components/FrequencyControl";
import { Fundamental } from "./classes/Partials.js";

function App() {
  
  const [midiKey, setMidiKey] = useState(null);
  const [partialNumbers, setPartialNumbers] = useState([]);
  const [flippedNotes, setFlippedNotes] = useState(Array(24).fill(false));

  const fundamental = useMemo(
    () => midiKey != null ? new Fundamental(midiKey) : null, [midiKey]
  );

  const partials = useMemo(() => {
    return partialNumbers
      .map(n => fundamental?.getPartial(n, flippedNotes[n - 1]))
      .filter(Boolean)
  }, [partialNumbers, fundamental, flippedNotes]);

  const [maxPartials, setMaxPartials] = useState(8);

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
      {/* <FrequencyControl
        fundamental={fundamental}
        onChange={setFundamental}
      /> */}

      <Notation 
        partials={partials}
        maxPartials={maxPartials}
        setFlippedNotes={setFlippedNotes}
      />

      <PartialSelector
        fundamental={fundamental}
        maxPartials={maxPartials}
        partialNumbers={partialNumbers}
        setPartialNumbers={setPartialNumbers}
        flippedNotes={flippedNotes}
      />

      <Playback 
        partials={partials}
        maxPartials={maxPartials}
      />

      <Piano
        midiKey={midiKey}
        setMidiKey={setMidiKey}
        setFlippedNotes={setFlippedNotes}
      />
    </div>
  );
}

export default App;
