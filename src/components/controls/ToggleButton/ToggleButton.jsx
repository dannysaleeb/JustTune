import styles from "./ToggleButton.module.css";

export default function ToggleButton({
  value,
  disabled = false,
  onChange,
  title,
  children,
  size = "independent"
}) {
  const className = [
    styles.toggle,
    value ? styles.active : styles.inactive,
    disabled && styles.disabled,
    size === "sub" ? styles.subToggle : styles.independentToggle
  ]
    .filter(Boolean)
    .join(" ");

  function handleClick() {
    if (disabled) return;
    onChange?.(!value);
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}
