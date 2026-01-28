import { COLOURS } from "../config.js";

import Settings from "./Settings.jsx";
import Notation from "./Notation.jsx";
import PartialSelector from "./PartialSelector.jsx";
import Piano from "./Piano.jsx"

export default function DesktopLayout({
  partials,
  partialNumbers,
  setPartialNumbers,
  settings,
  setSetting,
  fundamental,
  flippedNotes,
  setFlippedNotes,
  midiKey,
  setMidiKey,
  setPlayTrigger
}) {
  return (

    <div className="appContainer">

      <Settings
        fundamental={fundamental}
        settings={settings}
        setSetting={setSetting}
      />

      <Notation 
        partials={partials} 
        settings={settings} 
        setFlippedNotes={setFlippedNotes}
      />

      <PartialSelector  
        fundamental={fundamental}
        partialNumbers={partialNumbers}
        setPartialNumbers={setPartialNumbers}
        flippedNotes={flippedNotes}
        settings={settings}
        colours={COLOURS}
      />

      <Piano 
        midiKey={midiKey}
        setMidiKey={setMidiKey}
        setFlippedNotes={setFlippedNotes}
        setPlayTrigger={setPlayTrigger} 
      />

    </div>
  );
}
