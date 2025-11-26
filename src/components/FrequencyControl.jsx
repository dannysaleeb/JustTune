import { useState } from "react";
import { Fundamental } from "../classes/Partials.js";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function FrequencyControl({ fundamental, onChange }) {
  const [hzAdjust, setHzAdjust] = useState(0);
  const [centsAdjust, setCentsAdjust] = useState(0);

  const baseA4 = 440;
  const disabled = !fundamental;
  
  // adjusting Hz is proportional, relative to A 440 + - whatever   
  const applyHz = () => {
    if (!fundamental) return;
    const newFundamental = new Fundamental(fundamental.midikey);
    // calculate proportional factor relative to baseA4
    const factor = (baseA4 + hzAdjust) / baseA4;
    // convert factor to equivalent Hz delta to pass to adjustFreqByHertz
    const newFreq = newFundamental.frequency * factor;
    const actualHzAdjustment = newFreq - newFundamental.frequency;
    newFundamental.adjustFreqByHertz(actualHzAdjustment);
    onChange(newFundamental);
  };

  const applyCents = () => {
    if (!fundamental) return;
    const newFundamental = new Fundamental(fundamental.midikey);
    newFundamental.adjustFreqByCents(centsAdjust);
    onChange(newFundamental);
  };

  const reset = () => {
    if (!fundamental) return;
    const newFundamental = new Fundamental(fundamental.midikey);
    newFundamental.resetFrequency();
    onChange(newFundamental);
    setHzAdjust(0);
    setCentsAdjust(0);
  };

  const displayA4 = baseA4 + hzAdjust;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Frequency slider */}
      <div>
        <label>A {displayA4} Hz</label>
		<Slider
		  min={-20}
		  max={20}
		  step={1}
		  value={hzAdjust}
		  onChange={setHzAdjust}
          disabled={disabled}
          trackStyle={{ backgroundColor: "transparent", height: 2 }}
          railStyle={{ backgroundColor: "#ccc", height: 2 }}
          handleStyle={{ borderColor: "#000", height: 20, width: 20, marginTop: -9 }}
          dotStyle={{ display: "none" }}
          activeDotStyle={{ display: "none" }}
		/>
        <button onClick={applyHz} disabled={disabled} style={{ marginTop: 5 }}>
          Apply Hz
        </button>
      </div>

      {/* Cents slider */}
      <div>
        <label>Cents: {centsAdjust >= 0 ? "+" : ""}{centsAdjust}</label>
        <Slider
          min={-25}
          max={25}
          step={1}
          value={centsAdjust}
          onChange={setCentsAdjust}
          disabled={disabled}
          trackStyle={{ backgroundColor: "transparent", height: 2 }}
          railStyle={{ backgroundColor: "#ccc", height: 2 }}
          handleStyle={{ borderColor: "#000", height: 20, width: 20, marginTop: -9 }}
          dotStyle={{ display: "none" }}
          activeDotStyle={{ display: "none" }}
        />
        <button onClick={applyCents} disabled={disabled} style={{ marginTop: 5 }}>
          Apply Cents
        </button>
      </div>

      <button onClick={reset} disabled={disabled}>Reset Tuning</button>

      <div>
        <strong>Current Fundamental Frequency:</strong>{" "}
        {fundamental ? fundamental.frequency.toFixed(2) : "---"} Hz
      </div>
    </div>
  );
}

// to do
// make it look nice (ticks on slider?)
// add preset tunings instead of the slider? 440, 442, etc or preset slide points + custom option?