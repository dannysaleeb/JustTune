import { useState } from "react";
import { HiOutlineInformationCircle, HiXMark } from "react-icons/hi2";
import ToggleButton from "./controls/ToggleButton/ToggleButton";
import styles from "./styles/InfoPopup.module.css";

export default function InfoPopup() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.infoWrapper}>
      {/* Toggle button next to title */}
      <ToggleButton
        value={open}
        onChange={() => setOpen(prev => !prev)}
        title="Info"
      >
        <HiOutlineInformationCircle size={29} />
      </ToggleButton>

      {/* Popup box */}
      {open && (
        <div className={styles.infoBox}>
          <button
            className={styles.closeButton}
            onClick={() => setOpen(false)}
            aria-label="Close info"
          >
            <HiXMark size={16} />
          </button>

          <div className={styles.content}>
            <h2>About This App</h2>
            <p>Created by Fintan O'Hare & Danny Saleeb</p>
            <p>Based on an original app by Clement Power & Martin Suckling</p>
			<p>Other info here etc, etc.</p>
          </div>
        </div>
      )}
    </div>
  );
}
