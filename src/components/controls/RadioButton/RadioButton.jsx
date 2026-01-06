import ToggleButton from "../ToggleButton/ToggleButton";
import styles from "./RadioButton.module.css";

export default function RadioButton({
  selected,
  options,
  onChange,
  disabled = false,
  renderOption,
}) {
  return (
    <div className={styles.radioGroup}>
      {options.map(option => (
        <ToggleButton
          key={option}
          value={selected === option}
          disabled={disabled}
          onChange={() => onChange(option)}
          size={"sub"}
        >
          {renderOption ? renderOption(option) : option}
        </ToggleButton>
      ))}
    </div>
  );
}
