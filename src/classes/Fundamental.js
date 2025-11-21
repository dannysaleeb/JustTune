class Partial {
    constructor(partialNumber, fundamental) {
        this.partialNumber = partialNumber;
        this.fundamental = fundamental;
        this.frequency = partialNumber * fundamental.frequency;

        // placeholder
        this.notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

        this.noteName = this.getNoteName();
    }

    getNoteName() {
        let length = this.notes.length;
        return this.notes[this.partialNumber % length];
    }
}

class Fundamental {
  constructor(frequency, noteName) {
    this.frequency = frequency;
    this.noteName = noteName;
    this.keySig = this.getKeySig(noteName);
  }

  getPartial(n) {
    return new Partial(n, this)
  }

  getKeySig(noteName) {
    // to implement
    return [0, 0, 0, 0, 0, 0, 0]
  }

}

class NoteName {
    constructor(degree, accidental) {
        this.degree = degree;
        this.accidental = accidental;
    }
}

// 
// USAGE: on partial selection (button carries partialNumber, & fundamental context is set)
// 

// take it that these selections are made:
const button = {partialNumber: 3}; // represents partialNum 3 button pressed
const fundamentalContext = new Fundamental(55, new NoteName(6, 0)) // represents low A-nat fundamental selected 
//

// need to consider how NoteName is assigned to fundamental on keyboard press

const partial = new Partial(button.partialNumber, fundamentalContext);

console.log(`Fundamental frequency is: ${partial.fundamental.frequency}Hz`);
console.log(`Selected partial (3) frequency is: ${partial.frequency}Hz`);
console.log(`Frequency of 7th partial is: ${fundamentalContext.getPartial(7).frequency}Hz`);
