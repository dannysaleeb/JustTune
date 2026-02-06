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

import DirectionalRadio from "./controls/DirectionalRadio/DirectionalRadio";
import ToggleButton from "./controls/ToggleButton/ToggleButton";
import settingsStyles from "./styles/Settings.module.css";

const enharmonicSymbols = [flatIcon, naturalIcon, sharpIcon];

export default function NotationSettings({ fundamental, settings, setSetting }) {
    const iconStyle = { height: "65%", width: "auto", pointerEvents: "none" };

    return (
        <div className={settingsStyles.settingsItemContainer}>
                {/* LEFT GROUP: Global Display Toggles */}
                <div>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "var(--control-gap)" }}>
                        <ToggleButton
                            value={settings.doubles}
                            onChange={() => setSetting("doubles", !settings.doubles)}
                            title="Allow double sharps / flats"
                        >
                            <img
                                src={settings.doubles ? doubleSharpsIcon : doubleSharpsInactive}
                                style={iconStyle}
                                alt="##"
                            />
                        </ToggleButton>

                        <ToggleButton
                            value={settings.naturals}
                            onChange={() => setSetting("naturals", !settings.naturals)}
                            title="Show naturals"
                        >
                            <img
                                src={settings.naturals ? showNaturalsIcon : hideNaturalsIcon}
                                style={iconStyle}
                                alt="♮"
                            />
                        </ToggleButton>

                        <ToggleButton
                            value={settings.colours}
                            onChange={() => setSetting("colours", !settings.colours)}
                            title="Colours"
                        >
                            <img
                                src={settings.colours ? showColoursIcon : hideColoursIcon}
                                style={iconStyle}
                                alt="color"
                            />
                        </ToggleButton>
                    </div>
                    <div>notation</div>
                </div>

                {/* RIGHT GROUP: Enharmonic Control */}
                <div>
                    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", minHeight: "var(--button-size)" }}>
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
                    <div>enharmonic flip</div>
                </div>
        </div>
    );
}
