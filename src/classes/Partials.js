import * as Tone from "tone";
import keys from "../assets/keys.json";
import { Accidental, StaveNote, Annotation } from "vexflow";

// GLOBALS (DO NOT CHANGE)
const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const DEGREES = [1, 1, 5, 1, 3, 5, 7, 1, 2, 3, 5, 5, 6, 7, 7, 1, 2, 2, 3, 3, 4, 5, 4, 5]; // 1-based indexing into NOTES (DO NOT CHANGE)
const ADJUSTMENTS = [0, 0, 0, 0, 0, 0, -1, 0, 0, 0, -1, 0, -1, -1, 0, 0, -1, 0, -1, 0, 0, -1, 1, 0]; // (DO NOT CHANGE)
const PITCH_CLASS_DEGREES = [0, 2, 4, 5, 7, 9, 11];
const ACCIDENTAL_SYMBOLS = ["bb", "b", "n", "#", "##"];
const CENT_DEVIATION_THRESHOLD = 25;

// CHANGE-ABLE
const COLOURS = ["rgba(255, 0, 0, 1)", "rgba(255, 112, 0, 1)", "rgba(200, 187, 0, 1)", "rgba(0, 159, 19, 1)", "rgba(0, 255, 255, 1)", "rgba(0, 0, 255, 1)"]


// FLAGS (to go in relevant component/s, or top of App.jsx as controllable in settings)
const DOUBLE_SHARPS_AND_FLATS = false; // so far un-used
const NATURALS_FLAG = false;
const COLOURS_FLAG = true;

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

        // midikey for clef
        this.midikey = Tone.ftom(this.frequency);

        this.note = this.getNote();

    }

    getOctave(n) {
      return Math.floor(Math.log2(n));
    }

    getNote() {

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

      // Shift notated octave if too high/low
      let octave = Math.floor((this.midikey - accidental) / 12) - 1;
      let octava = 0;

      // ! Fine -- this will work, but need to restrict fundamental octave choice in UI Piano, it doesn't need to go so high.
      // ! only as high as C4 upper limit, I would say ...
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

      // if it's anything but Dbb and B# will go to wrong octave? Also Cb

      let symbol = "";
      if (NATURALS_FLAG) {
        symbol = ACCIDENTAL_SYMBOLS[accidental + 2]; // offset to get correct sign
      } else {
        if (accidental != 0) {
          symbol= ACCIDENTAL_SYMBOLS[accidental + 2]; // offset to get correct sign
        }
      }

      let name = degreeName + symbol + "/" + octave;
      
      let colour = "rgba(0,0,0,1)";
      if (COLOURS_FLAG) {colour = COLOURS[this.getColourIndex()]}

      let clef = "";
      if (this.midikey > 59) { clef = "treble" } else { clef = "bass" };

      return new Note(degree, accidental, arrow, centDeviation, octave, name, colour ? colour : "rgba(0, 0, 0, 1)", clef, octava);
      
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

        const accidentalMap = ['DoubleFlat', 'Flat', 'Natural', 'Sharp', 'DoubleSharp'];

        if (this.note.arrow) {
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
        if (NATURALS_FLAG) {
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

        if (this.note.centDeviation !== 0) {
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

    enharmonicSwitch() {
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
      if (NATURALS_FLAG) {
        symbol = ACCIDENTAL_SYMBOLS[winner.difference + 2]; // offset to get correct sign
      } else {
        if (winner.difference !== 0) {
          symbol = ACCIDENTAL_SYMBOLS[winner.difference + 2]; // offset to get correct sign
        }
      }

      let name = degreeName + symbol + "/" + winner.octave;

      // ! check for octava ... might have SHIFTED
      
      this.setNote(winner.degree, winner.difference, this.note.arrow, this.note.centDeviation, winner.octave, name, this.note.colour, this.note.clef, this.note.octava);

      return this;

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

export { Partial, Fundamental, Note }; // removed test and added this line (only change except for import keys) //
