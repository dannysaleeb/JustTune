// controls import
import RadioButton from "./controls/RadioButton/RadioButton";
import StepperDial from "./controls/StepperDial/StepperDial";
import ToggleButton from "./controls/ToggleButton/ToggleButton"; // <-- added import

// settingsStyles for styling common to all components within Settings.jsx
import settingsStyles from "./styles/Settings.module.css";

// tuningStyles for styling specific to TuningSettings.jsx
import tuningStyles from "./styles/TuningSettings.module.css";

export default function TuningSettings({ settings, setSetting }) {
    // Determine if either toggle is active
    const isPlus50 = settings.centDeviation === 50;
    const isMinus50 = settings.centDeviation === -50;
    const toggleActive = isPlus50 || isMinus50;

    return (
        <div className={settingsStyles.settingsItemContainer}>
            {/* Tuning system radio */}
            <RadioButton 
                selected={settings.tuningSystem}
                options={["JI", "12EDO"]}
                onChange={(option) => setSetting("tuningSystem", option)}
            />

            {/*
            // ! DISCRETE TUNING SELECTORS, DOUBT WE NEED (keep as comment in case)
            <RadioButton
                selected={settings.tuningFrequencyOption}
                options={[435, 440, 443, 445]}
                onChange={(option) => (
                    setSetting("tuningFrequencyOption", option),
                    setSetting("tuningFrequency", option)
                )}
            /> 
            */}

            {/* Tuning frequency dial */}
            <StepperDial
                value={settings.tuningFrequency ?? 440}
                min={415}
                max={450}
                step={1}
                onChange={(v) => setSetting("tuningFrequency", v)}
                label={"A"}
            />

            {/* Cents offset dial */}
            <StepperDial
                value={toggleActive ? 0 : (settings.centDeviation ?? 0)} // reset to 0 if toggle active
                min={-50}
                max={50}
                step={1}
                onChange={(v) => setSetting("centDeviation", v)}
                label={"¢"}
                disabled={toggleActive} // disable if toggle selected
            />

            {/* +50c / -50c toggle buttons */}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <ToggleButton
                    value={isMinus50}
                    onChange={() =>
                        setSetting("centDeviation", isMinus50 ? 0 : -50)
                    }
                >
                    -50¢
                </ToggleButton>                
				<ToggleButton
                    value={isPlus50}
                    onChange={() =>
                        setSetting("centDeviation", isPlus50 ? 0 : 50)
                    }
                >
                    +50¢
                </ToggleButton>
            </div>
        </div>
    );
}
