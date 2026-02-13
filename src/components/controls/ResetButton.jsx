import { HiOutlineArrowPath } from "react-icons/hi2"; // Standard reset/refresh icon
import ToggleButton from "./ToggleButton";

export default function ResetButton({ onReset }) {
  return (
    <ToggleButton
      onChange={onReset} 
      title="Reset App"
    >
      <HiOutlineArrowPath style={{ width: '1.2em', height: '1.2em' }} />
    </ToggleButton>
  );
}
