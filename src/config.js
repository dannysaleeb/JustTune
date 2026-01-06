const DEFAULT_SETTINGS = Object.freeze({
    "mute": true,
    "doubles": false,
    "naturals": false,
    "colours": true,
    "maxPartials": 8,
    "playbackMode": "triangle",
    "tuningSystem": "JI",
    "tuningFrequency": 440,
    "tuningFrequencyOption": 440,
    "centDeviation": 0,
    "enharmonicToggle": 0
});

const COLOURS = ["rgba(230, 159, 0, 1)", "rgba(86, 180, 233, 1)", "rgba(0, 158, 115, 1)", "rgba(204, 121, 167, 1)", "rgba(0, 114, 178, 1)", "rgba(213, 94, 0, 1)"];

const KEY_TO_PARTIAL = {
  // Row 1
  "1": 1, "2": 2, "3": 3, "4": 4,
  "5": 5, "6": 6, "7": 7, "8": 8,

  // Row 2
  "q": 9, "w": 10, "e": 11, "r": 12,
  "t": 13, "y": 14, "u": 15, "i": 16,

  // Row 3
  "a": 17, "s": 18, "d": 19, "f": 20,
  "g": 21, "h": 22, "j": 23, "k": 24,
};

export { DEFAULT_SETTINGS, COLOURS, KEY_TO_PARTIAL };
