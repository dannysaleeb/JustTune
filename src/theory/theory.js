const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const DEGREES = [1, 1, 5, 1, 3, 5, 7, 1, 2, 3, 5, 5, 6, 7, 7, 1, 2, 2, 3, 3, 4, 5, 4, 5]; // 1-based indexing into NOTES
const ADJUSTMENTS = [0, 0, 0, 0, 0, 0, -1, 0, 0, 0, -1, 0, -1, -1, 0, 0, -1, 0, -1, 0, 0, -1, 1, 0];
const PITCH_CLASS_DEGREES = [0, 2, 4, 5, 7, 9, 11];
const ACCIDENTAL_SYMBOLS = ["bb", "b", "n", "#", "##"];
const CENT_DEVIATION_THRESHOLD = 25;

export { NOTES, DEGREES, ADJUSTMENTS, PITCH_CLASS_DEGREES, ACCIDENTAL_SYMBOLS, CENT_DEVIATION_THRESHOLD}