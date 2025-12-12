import * as Tone from "tone";

import keys from "../theory/keys.json";
import { 
  NOTES, 
  DEGREES, 
  ADJUSTMENTS, 
  PITCH_CLASS_DEGREES, 
  ACCIDENTAL_SYMBOLS,
  CENT_DEVIATION_THRESHOLD
} from "../theory/theory.js";

import { Accidental, StaveNote, Annotation } from "vexflow";
import { COLOURS, DEFAULT_SETTINGS } from "../config";

class Fundamental {
  constructor(midikey, keyIndex=DEFAULT_SETTINGS.enharmonicToggle) {
    
    this.midikey = midikey;
    this.frequency = Tone.mtof(midikey);
    this.originalFrequency = this.frequency;

    const i = midikey % 12;
    const keyData = keys[i][keyIndex] ? keys[i][keyIndex] : keys[i][0];

    this.name = keyData.name;
    this.degree = keyData.degree;
    this.key = keyData.key;

    this.octave = Math.floor(midikey / 12) - 1;
  
  }

  getPartial(n, flipped=false, settings=DEFAULT_SETTINGS) {
    return new Partial(n, this, flipped, settings)
  }

  setFrequency(hz) {
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
    constructor(partialNumber, fundamental, flip=false, settings=DEFAULT_SETTINGS) {

        this.partialNumber = partialNumber;
        this.fundamental = fundamental;
        this.frequency = partialNumber * fundamental.frequency;
        this.settings = settings;

        // midikey for clef
        this.midikey = Math.round(fundamental.midikey + 12 * Math.log2(this.partialNumber));

        this.note = this.getNote();
        if (flip) {this.note = this.getEnharmonicEquivalent()}
    }

    getNote() {

      // gets the expected degree of the scale
      const degree = DEGREES[this.partialNumber - 1];

      // expected + adjustment
      const accidental = this.fundamental.key[((degree + this.fundamental.degree) - 1) % 7] + ADJUSTMENTS[this.partialNumber - 1];

      // getEnharmonicRespelling should return a note? So here I can just return a switched note ... this is badly organised!! 

      const centDeviation = Math.round(this.getCentDeviation());

      let arrow = null;

      if (centDeviation >= CENT_DEVIATION_THRESHOLD) { 
        arrow = "up"
      } else if (centDeviation <= (CENT_DEVIATION_THRESHOLD * -1)) {
        arrow = "down"
      }

      // ! get correct octave according to midikey
      let octave = Math.floor((this.midikey - accidental) / 12) - 1;
      let octava = 0;

      // ! shift octave up/down as needed
      if (this.midikey >= 90 && this.midikey < 102) {
        octave -= 1;
        octava = 1;
      } else if (this.midikey >= 102) {
        octave -= 2;
        octava = 2;
      } else if (this.midikey <= 31) {
        octave += 1;
        octava = -1;
      };

      // construct name
      const degreeName = NOTES[((degree + this.fundamental.degree) - 1) % 7];

      let symbol = "";
      if (this.settings.naturals) {
        symbol = ACCIDENTAL_SYMBOLS[accidental + 2]; // +2 offset to get correct sign
      } else {
        if (accidental != 0) {
          symbol= ACCIDENTAL_SYMBOLS[accidental + 2]; // +2 offset to get correct sign
        }
      }

      let name = degreeName + symbol + "/" + octave; // vexflow format
      
      let colour = "rgba(0,0,0,1)";
      if (this.settings.colours) {colour = COLOURS[this.getColourIndex()]}

      let clef = "";
      if (this.midikey > 59) { clef = "treble" } else { clef = "bass" };

      return new Note(degree, accidental, arrow, centDeviation, octave, name, colour, clef, octava);
      
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

    getRenderable() {

        let accidental = ACCIDENTAL_SYMBOLS[this.note.accidental + 2];

        if (!this.settings.doubles) {
          if (this.note.accidental < -1 || this.note.accidental > 1) {
            this.note = this.getEnharmonicEquivalent();
            accidental = ACCIDENTAL_SYMBOLS[this.note.accidental + 2];
          }
        };

        const accidentalMap = ['DoubleFlat', 'Flat', 'Natural', 'Sharp', 'DoubleSharp'];

        if (this.note.arrow && !this.settings.use12EDO) {
          if (this.note.arrow === "up") {
            accidental = `accidental${accidentalMap[this.note.accidental + 2]}ArrowUp`
          } else if (this.note.arrow === "down") {
            accidental = `accidental${accidentalMap[this.note.accidental + 2]}ArrowDown`
          }
        };

        const octave = String(this.note.octave);

        let colour = this.note.colour;

        let note = new StaveNote({ clef: this.note.clef, keys: [this.note.name], duration: "q"});

        // this toggles NATURALS (but need to make sure they show with arrows if needed)
        if (this.settings.naturals) {
          // note.addModifier(new Accidental(accidental));
          note.addModifier(new Accidental(accidental));
        } else {
          if (this.note.accidental !== 0 || this.note.arrow) {
            note.addModifier(new Accidental(accidental));
          }
        };

        note.setStyle({
          strokeStyle: colour,
          fillStyle: colour
        })
        .setStemStyle({
          strokeStyle: "rgba(0,0,0,0)",   // transparent outline
          fillStyle:   "rgba(0,0,0,0)"    // transparent interior
        });

        if (this.note.centDeviation !== 0 && !this.settings.use12EDO) {
          let text = String(this.note.centDeviation);
          note.addModifier(new Annotation(this.note.centDeviation > 0 ? "+" + text : text).setVerticalJustification('bottom'))
        }

        return note;
    }

    getColourIndex() {
      let colourIndex = 0;

      let partialNum = this.partialNumber;
      
      // if not prime, divide by 2 until prime
      if (this.partialNumber % 2 === 0) {
          while (Number.isInteger(partialNum / 2)) {
              partialNum /= 2
          }
      };

      for (let i = 0; i < partialNum; i++) {
          if (!(i % 2 === 0)) { colourIndex++ } 
      }

      return colourIndex
    }

    setNote(degree, accidental, arrow, centDeviation, octave, name, colour, clef, octava) {
      this.note = new Note(degree, accidental, arrow, centDeviation, octave, name, colour, clef, octava);
    }

    getEnharmonicEquivalent() {
      // actual pitch class of this note
      const pc = this.midikey % 12;

      // index for PITCH_CLASS_DEGREES, to get lower and upper degrees (naturals) ... 
      const pc_degree_index = NOTES.indexOf(this.note.name[0])

      // get degree as pitch class (accidental-agnostic)
      const pc_degree = PITCH_CLASS_DEGREES[pc_degree_index];

      let lower_pc_degree, upper_pc_degree, lower_octave, upper_octave, upper_diff, lower_diff;

      if (pc_degree === 0) {
        
        lower_pc_degree = 11;
        upper_pc_degree = PITCH_CLASS_DEGREES[pc_degree_index + 1];
        
        lower_octave = this.note.octave - 1;
        upper_octave = this.note.octave;

        upper_diff = pc_degree - upper_pc_degree + this.note.accidental;
        lower_diff = 12 - lower_pc_degree + this.note.accidental;

      } else if (pc_degree === 11) {
        
        lower_pc_degree = PITCH_CLASS_DEGREES[pc_degree_index - 1];
        upper_pc_degree = 0; 
        
        lower_octave = this.note.octave;
        upper_octave = this.note.octave + 1

        upper_diff = -1 - upper_pc_degree + this.note.accidental;
        lower_diff = pc_degree - lower_pc_degree + this.note.accidental;

      } else {
        lower_pc_degree = PITCH_CLASS_DEGREES[pc_degree_index - 1];
        upper_pc_degree = PITCH_CLASS_DEGREES[pc_degree_index + 1];

        lower_octave = this.note.octave;
        upper_octave = this.note.octave;

        upper_diff = pc_degree - upper_pc_degree + this.note.accidental;
        lower_diff = pc_degree - lower_pc_degree + this.note.accidental;
      }

      const minimum_diff = Math.min(Math.abs(upper_diff), Math.abs(lower_diff));

      // this is shonky as hell
      let winner;
      if (minimum_diff === Math.abs(upper_diff)) {
        winner = {
          "difference": upper_diff,
          "pc_degree": upper_pc_degree,
          "octave": upper_octave
        }
      } else {
        winner = {
          "difference": lower_diff,
          "pc_degree": lower_pc_degree,
          "octave": lower_octave
        }
      };

      // construct name
      const degreeName = NOTES[PITCH_CLASS_DEGREES.indexOf(winner.pc_degree)];

      let symbol = "";
      if (this.settings.naturals) {
        symbol = ACCIDENTAL_SYMBOLS[winner.difference + 2]; // offset to get correct sign
      } else {
        if (winner.difference !== 0) {
          symbol = ACCIDENTAL_SYMBOLS[winner.difference + 2]; // offset to get correct sign
        }
      }

      let name = degreeName + symbol + "/" + winner.octave;

      // ! check for octava ... might have SHIFTED

      return new Note(winner.pc_degree, winner.difference, this.note.arrow, this.note.centDeviation, winner.octave, name, this.note.colour, this.note.clef, this.note.octava);
    }
}

class Note {
    constructor(degree, accidental, arrow, centDeviation, octave, name, colour, clef, octava) {
        this.degree = degree;
        this.accidental = accidental;
        this.arrow = arrow;
        this.centDeviation = centDeviation;
        this.octave = octave;
        this.name = name;
        this.colour = colour;
        this.clef = clef;
        this.octava = octava;
    }
}

export { Partial, Fundamental, Note };
