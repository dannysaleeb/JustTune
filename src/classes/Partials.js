// this import is mental, there is probably a better way
import * as Tone from "tone";
import fs from "node:fs/promises";

const keys = JSON.parse(
    await fs.readFile(
        new URL("../assets/keys.json", import.meta.url)
    )
);

// GLOBALS (can live here)
const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const DEGREES = [1, 1, 5, 1, 3, 5, 7, 1, 2, 3, 5, 5, 6, 7, 7, 1, 2, 2, 3, 3, 4, 5, 4, 5]; // 1-based indexing into NOTES
const ADJUSTMENTS = [0, 0, 0, 0, 0, 0, -1, 0, 0, 0, -1, 0, -1, -1, 0, 0, -1, 0, -1, 0, 0, -1, 1, 0]; // etc.
const ACCIDENTAL_SYMBOLS = ["bb", "b", "nat", "#", "##"];

const CENT_DEVIATION_THRESHOLD = 25;

// FLAGS (to go in relevant component/s, or top of App.jsx as controllable in settings)
const DOUBLE_SHARPS_AND_FLATS = false; // so far un-used .. enharmonic re-spelling to be implemented
const NATURALS_FLAG = false;

class Fundamental {
  constructor(midikey) {
    
    this.midikey = midikey;
    this.frequency = Tone.mtof(midikey);
    this.originalFrequency = this.frequency;

    const i = midikey % 12;

    this.name = keys[i][0].name;
    this.degree = keys[i][0].degree;
    this.key = keys[i][0].key;

    this.octave = Math.floor(midikey / 12) - 1;
  
  }

  getPartial(n) {
    return new Partial(n, this)
  }

  setFrequency(hz) {
    // add bounds relative to this.originalFrequency?
    // do this in UI
    this.frequency = hz;

    return this
  }

  adjustFreqByHertz(hz) {
    this.frequency += hz;
    return this
  }

  adjustFreqByCents(cents) {
    this.frequency *= Math.pow(2, cents / 1200);
    return this
  }

  resetFrequency() {
    this.frequency = this.originalFrequency;
    return this
  }

}

class Partial {
    constructor(partialNumber, fundamental) {

        this.partialNumber = partialNumber;
        this.fundamental = fundamental;
        this.frequency = partialNumber * fundamental.frequency;

        this.note = this.getNote();

    }

    getOctave(n) {
      return Math.floor(Math.log2(n));
    }

    getNote() {
      const degree = DEGREES[this.partialNumber - 1];

      // expected + adjustment
      const accidental = this.fundamental.key[((degree + this.fundamental.degree) - 1) % 7] + ADJUSTMENTS[this.partialNumber - 1];

      const centDeviation = Math.round(this.getCentDeviation());

      let arrow = null;


      if (centDeviation >= CENT_DEVIATION_THRESHOLD) { 
        arrow = "-UP"
      } else if (centDeviation <= (CENT_DEVIATION_THRESHOLD * -1)) {
        arrow = "-DOWN"
      }

      const octave = this.getOctave(this.partialNumber) + this.fundamental.octave;

      // construct name
      const degreeName = NOTES[((degree + this.fundamental.degree) - 1) % 7];

      let symbol = "";
      if (NATURALS_FLAG) {
        symbol = ACCIDENTAL_SYMBOLS[accidental + 2]; // offset to get correct sign
      } else {
        if (accidental != 0) {
          symbol= ACCIDENTAL_SYMBOLS[accidental + 2]; // offset to get correct sign
        }
      }

      let name = degreeName + symbol;

      if (arrow) {
        name += arrow
      }

      return new Note(degree, accidental, arrow, centDeviation, octave, name)
      
    }

    nearest12edoFrequency() {
      const originalFreq = this.fundamental.originalFrequency * this.partialNumber;
      const midiFloat = 69 + 12 * Math.log2(originalFreq / 440);
      const midiNearest = Math.round(midiFloat);
      return 440 * Math.pow(2, (midiNearest - 69) / 12);
    }

    getCentDeviation() {
      const originalFreq = this.fundamental.originalFrequency * this.partialNumber;
      return 1200 * Math.log2(originalFreq / this.nearest12edoFrequency());
    }

    render() {
      // render the note for this partial in Notation view, possible that this belongs as function in Notation component instead
    }

    play() {
      // if you see a need for this feel free to implement, otherwise can be removed
    }
}

class Note {
    constructor(degree, accidental, arrow, centDeviation, octave, name) {
        this.degree = degree;
        this.accidental = accidental;
        this.arrow = arrow;
        this.centDeviation = centDeviation;
        this.octave = octave;
        this.name = name;
    }
}


//-----------------//
// USAGE / TESTING //
//-----------------//

// KEYBOARD SELECTION
const midikey = 37; // represents partialNum 3 button pressed

// print first 5 partial note information and frequency values from related midikey selection
const f = new Fundamental(midikey);

for (let partialButton=1; partialButton < 6; partialButton++) {
  const partial = f.getPartial(partialButton);
  console.log(partial.note);
  console.log(`frequency: ${partial.frequency}`)
}

// adjust fundamental frequency by cents amount
f.adjustFreqByCents(50);

console.log("=================");
console.log("=================");

// reprint first 5 partials
for (let partialButton=1; partialButton < 6; partialButton++) {
  const partial = f.getPartial(partialButton);
  console.log(partial.note);
  console.log(`frequency: ${partial.frequency}`)
}


// to do:
// add function for enharmonic re-spelling
// defend for non-partials etc. / general tidying up
// actual notes on a stave..........
