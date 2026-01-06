import styles from "./DirectionalRadio.module.css";

export default function DirectionalRadio({
  value,
  enabled = true,
  onChange,
  leftSrc,
  rightSrc,
  leftArrowSrc,
  rightArrowSrc,
}) {

  const disabled = !enabled;

  const renderIcon = (src) => {
    return (<div className={styles.iconSlot} aria-hidden>
      {enabled && src && <img src={src} width={36} height={36} alt=""/>}
    </div>)
  };

  return (
    <div 
      className={[
        styles.row,
        disabled && styles.disabled,
      ].filter(Boolean).join(" ")}
    >
      <button
        disabled={disabled}
        className={value === 0 && !disabled ? styles.active : styles.inactive}
        onClick={() => onChange(0)}
      >
        {renderIcon(leftSrc)}
      </button>

      <div className="arrow">
        <img
          src={value === 0 ? leftArrowSrc : rightArrowSrc}
          width={36}
          height={36}
          alt=""
        />
      </div>

      <button
        disabled={disabled}
        className={value === 1 && !disabled ? styles.active : styles.inactive}
        onClick={() => onChange(1)}
      >
        {renderIcon(rightSrc)}
      </button>
      
    </div>
  );
}
