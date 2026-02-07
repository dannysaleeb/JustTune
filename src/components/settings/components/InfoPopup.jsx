import { HiOutlineInformationCircle } from "react-icons/hi2";
import ToggleButton from "./controls/ToggleButton/ToggleButton";

export default function InfoPopup({ onClick }) {
  return (
    <ToggleButton
      onChange={onClick} 
      title="Info"
    >
      <HiOutlineInformationCircle style={{ width: '1.2em', height: '1.2em' }} />
    </ToggleButton>
  );
}
