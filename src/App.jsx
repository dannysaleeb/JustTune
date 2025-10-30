// import the different elements
import { useState, useEffect } from "react";
import { getPartialFrequency } from "./utils/partials";
import Piano from "./components/Piano";
import PartialSelector from "./components/PartialSelector";
import CentDeviationControl from "./components/CentDeviationControl";
import Notation from "./components/Notation";
import Playback from "./components/Playback";

function App() {
  const [note, setNote] = useState("C4");
  const [partials, setPartials] = useState([1]);
  const [centDeviation, setCentDeviation] = useState(0);
  const [results, setResults] = useState([]);

  // Recalculate partial frequencies whenever inputs change --- keep everything updating whenever anything changes?
  useEffect(() => {
    if (!note || partials.length === 0) {
      setResults([]);
      return;
    }

    const res = partials.map((p) => getPartialFrequency(note, p, centDeviation));
    setResults(res);
  }, [note, partials, centDeviation]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>

      {/* Input components */}
      <Piano note={note} onChange={setNote} />
      <PartialSelector partials={partials} onChange={setPartials} />
      <CentDeviationControl
        centDeviation={centDeviation}
        onChange={setCentDeviation}
      />

      {/* Display results */}
      {results.length > 0 && <Notation results={results} />}

      {/* Continuous playback */}
      <Playback note={note} partials={partials} centDeviation={centDeviation} />
    </div>
  );
}

export default App;
