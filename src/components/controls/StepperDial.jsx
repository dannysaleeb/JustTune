import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import styles from "./controls_styles/StepperDial.module.css";

export default function StepperDial({
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v) => v.toString(),
  disabled = false
}) {
  const clamp = (v) => Math.min(max, Math.max(min, v));

  const increment = () => {
    if (disabled || value >= max) return;
    onChange(clamp(value + step));
  };

  const decrement = () => {
    if (disabled || value <= min) return;
    onChange(clamp(value - step));
  };

  return (
    <div
      className={`${styles.dial} ${disabled ? styles.disabled : ""}`}
      role="spinbutton"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <button
        type="button" // Always good to specify button type
        className={`${styles.chevron} ${styles.up}`}
        onClick={increment}
        disabled={disabled || value >= max}
        aria-label="Increase"
      >
        <FaChevronUp />
      </button>

      <div className={styles.value}>
        {format(value)}
      </div>

      <button
        type="button"
        className={`${styles.chevron} ${styles.down}`}
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Decrease"
      >
        <FaChevronDown />
      </button>
    </div>
  );
}
