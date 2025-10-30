import * as Tone from "tone";

// put lookup table here if we use one

export function getPartialFrequency(rootNoteWithOctave, partialNumber, centDeviation = 0) {
  // Get input note and octave
  const match = rootNoteWithOctave.match(/^([A-G][b#]?)(\d+)$/i);
  const rootNote = match[1];
  const rootOctave = parseInt(match[2], 10);

  // Get partial frequency
  const rootFreq = Tone.Frequency(rootNoteWithOctave).toFrequency();
  let freq = rootFreq * partialNumber;

  // input cent deviation
  freq *= Math.pow(2, centDeviation / 1200);

  // nearest 12-EDO note and octave
  const nearestNote = Tone.Frequency(freq).toNote();

  // get cent deviation relative to 12-EDO note: -- are we doing 24 EDO too?
  const nearestFreq = Tone.Frequency(nearestNote).toFrequency();
  const cents = 1200 * Math.log2(freq / nearestFreq);

  // Return results: partial number (for other elements), frequency (of the actual harmonic), nearest note, cent deviation (cents)
  return {
    partial: partialNumber,
    frequency: freq,
    nearestNote,
    cents
  };
}
