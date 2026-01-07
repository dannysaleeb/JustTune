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

    // Handler for changing cents via dial
    const handleDialChange = (v) => {
        // Clamp the value between -50 and 50
        const clamped = Math.max(-50, Math.min(50, v));

        // Update the setting
        setSetting("centDeviation", clamped);
    };

    // Handler for toggles
    const handleToggle = (value) => {
        setSetting("centDeviation", value);
    };

    return (
        <div className={settingsStyles.settingsItemContainer}>
            {/* Tuning system radio */}
            <RadioButton 
                selected={settings.tuningSystem}
                options={["JI", "12EDO"]}
                onChange={(option) => setSetting("tuningSystem", option)}
            />

            {/* Tuning frequency dial */}
            <StepperDial
                value={settings.tuningFrequency}
                min={415}
                max={450}
                step={1}
                onChange={(v) => setSetting("tuningFrequency", v)}
                label={"A"}
            />

            {/* Cents offset dial */}
            <StepperDial
                value={settings.centDeviation}
                min={-50}
                max={50}
                step={1}
                onChange={handleDialChange}
                label={"¢"}
                disabled={false} // always editable now
            />

            {/* +50c / -50c toggle buttons */}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <ToggleButton
                    value={isMinus50}
                    onChange={() => handleToggle(isMinus50 ? 0 : -50)}
                >
                    -50¢
                </ToggleButton>                
                <ToggleButton
                    value={isPlus50}
                    onChange={() => handleToggle(isPlus50 ? 0 : 50)}
                >
                    +50¢
                </ToggleButton>
            </div>
        </div>
    );
}
