import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS } from "../config";

const STORAGE_KEY = "justTuneSettings";

const PERSISTED_KEYS = [
  "doubles",
  "naturals",
  "colours",
  "maxPartials",
  "tuningFrequency",
  "tuningFrequencyOption",
  "enharmonicToggle",
  "playbackMode"
];

export default function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_SETTINGS;

      const persisted = JSON.parse(stored);

      return {
        ...DEFAULT_SETTINGS,
        ...persisted,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    const persisted = {};
    for (const key of PERSISTED_KEYS) {
      persisted[key] = settings[key];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  }, [settings]);

  function setSetting(key, value) {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }

  // --- SOFT RESET ---
  // optional flag: resetCents
  function resetSettings({ resetCents = true } = {}) {
    setSettings(prev => ({
      ...prev,
      ...(resetCents && { centDeviation: DEFAULT_SETTINGS.centDeviation })
    }));
  }

  return [settings, setSetting, resetSettings];
}
