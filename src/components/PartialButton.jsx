import styles from "./styles/PartialButton.module.css";

export default function PartialButton({ number, selected, disabled, ...handlers }) {
  const className = [
    styles.button,
    selected ? styles.selected : styles.unselected,
    disabled && styles.disabled
  ].filter(Boolean).join(" ");

  return (
    <div className={className} {...handlers}>
      {number}
    </div>
  );
}
