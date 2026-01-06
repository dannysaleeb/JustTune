import doubleSharpsIcon from "../assets/icons/doublesharps.svg";
import doubleSharpsInactive from "../assets/icons/doublesharps_inactive.svg";
import showNaturalsIcon from "../assets/icons/shownaturals.svg";
import hideNaturalsIcon from "../assets/icons/hidenaturals.svg";
import showColoursIcon from "../assets/icons/showcolours.svg";
import hideColoursIcon from "../assets/icons/hidecolours.svg";
import leftRightIcon from "../assets/icons/left_right.svg";
import rightLeftIcon from "../assets/icons/right_left.svg";

import flatIcon from "../assets/icons/flat.svg";
import naturalIcon from "../assets/icons/natural.svg";
import sharpIcon from "../assets/icons/sharp.svg";

// controls import
import DirectionalRadio from "./controls/DirectionalRadio/DirectionalRadio";
import ToggleButton from "./controls/ToggleButton/ToggleButton";

// settingsStyles for styling common to all components within Settings.jsx
import settingsStyles from "./styles/Settings.module.css";

// notationStyles for styling specific to NotationSettings.jsx
import notationStyles from "./styles/NotationSettings.module.css"

const enharmonicSymbols = [flatIcon, naturalIcon, sharpIcon];

export default function NotationSettings({fundamental, settings, setSetting}) {
    return (
        <div className={settingsStyles.settingsItemContainer}>
            {/* Double Sharps / Flats Toggle */}
            <ToggleButton
                value={settings.doubles}
                onChange={() => setSetting("doubles", !settings.doubles)}
                children={
                <img
                    src={
                        settings.doubles
                        ? doubleSharpsIcon
                        : doubleSharpsInactive
                    }
                    style={{ width: "24px", height: "24px" }}
                    alt="##"
                />
                }
                title="Allow double sharps / flats"
            />
    
            {/* Naturals Toggle */}
            <ToggleButton
                value={settings.naturals}
                onChange={() => setSetting("naturals", !settings.naturals)}
                children={
                <img
                    src={
                        settings.naturals
                        ? showNaturalsIcon
                        : hideNaturalsIcon
                    }
                    style={{ width: "24px", height: "24px" }}
                    alt="##"
                />
                }
                title="Show naturals"
            />
    
            {/* Colours Toggle */}
            <ToggleButton
                value={settings.colours}
                onChange={() => setSetting("colours", !settings.colours)}
                children={
                <img
                    src={
                        settings.colours
                        ? showColoursIcon
                        : hideColoursIcon
                    }
                    style={{ width: "24px", height: "24px" }}
                    alt="##"
                />
                }
                title="Colours"
            />

            {/* Enharmonic flip */}
            <DirectionalRadio
                value={settings.enharmonicToggle}
                enabled={Boolean(fundamental?.enharmonicOption)}
                onChange={(v) => setSetting("enharmonicToggle", v)}
                leftSrc={
                    fundamental
                    ? enharmonicSymbols[fundamental.enharmonicCurrent + 1]
                    : null
                }
                rightSrc={
                    fundamental
                    ? enharmonicSymbols[fundamental.enharmonicOther + 1]
                    : null
                }
                leftArrowSrc={leftRightIcon}
                rightArrowSrc={rightLeftIcon}
            />
        </div>
    )
}
