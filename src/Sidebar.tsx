import React from "react";
import { useTranslation } from "react-i18next";
import {
  handleAnimationChange,
  handleDirChange,
  handleExpressionChange,
  handleFilterInput,
  handlePMACheckboxChange,
  handleSceneChange,
  handleSettingChange,
  navigateAndTriggerChange,
} from "./js/events";
import { useAtom } from "jotai";
import { setCurrentSetting, settingAtom } from "./store";
import {
  selectorOptionsAtom,
  selectorStatesAtom,
  setSelectorState,
} from "./store/selectors";
import { addKeyboardListener } from "./keyboard";
import { resetSettingUI } from "./js/ui";

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [selectorOptions] = useAtom(selectorOptionsAtom);
  const [selectorStates] = useAtom(selectorStatesAtom);
  const [setting] = useAtom(settingAtom);

  React.useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const sidebarWidth = Number(
      rootStyles.getPropertyValue("--sidebar-width").replace("px", ""),
    );
    function onMouseMove(e: MouseEvent) {
      if (!rootRef.current) return;

      if (e.clientX <= sidebarWidth)
        rootRef.current.style.visibility = "visible";
      else rootRef.current.style.visibility = "hidden";
    }

    document.addEventListener("mousemove", onMouseMove);

    return () => document.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div id="sidebar" ref={rootRef}>
      <select
        value={selectorStates["dir"]?.value}
        onChange={(e) => {
          handleDirChange(e);
          setSelectorState("dir", {
            selectedIndex: Number(e.target.selectedIndex),
            value: e.target.value,
          });
        }}
        ref={(ref) => {
          if (!ref) return;

          addKeyboardListener("q", function () {
            navigateAndTriggerChange(ref, -1);
          });
          addKeyboardListener("w", function () {
            navigateAndTriggerChange(ref, 1);
          });
        }}
      >
        {selectorOptions["dir"]?.map((dir) => (
          <option value={dir.value} key={dir.value}>
            {dir.label}
          </option>
        ))}
      </select>
      <select
        value={selectorStates["scene"]?.value}
        onChange={(e) => {
          handleSceneChange(e);
          setSelectorState("scene", {
            selectedIndex: Number(e.target.selectedIndex),
            value: e.target.value,
          });
        }}
        ref={(ref) => {
          if (!ref) return;

          addKeyboardListener("a", function () {
            navigateAndTriggerChange(ref, -1);
          });
          addKeyboardListener("s", function () {
            navigateAndTriggerChange(ref, 1);
          });
        }}
      >
        {selectorOptions["scene"]?.map((dir) => (
          <option value={dir.value} key={dir.value}>
            {dir.label}
          </option>
        ))}
      </select>
      <select
        id="animationSelector"
        value={selectorStates["animate"]?.value}
        onChange={(e) => {
          handleAnimationChange(e);
          setSelectorState("animate", {
            selectedIndex: Number(e.target.selectedIndex),
            value: e.target.value,
          });
        }}
        ref={(ref) => {
          if (!ref) return;

          addKeyboardListener("z", function () {
            navigateAndTriggerChange(ref, -1);
          });
          addKeyboardListener("x", function () {
            navigateAndTriggerChange(ref, 1);
          });
        }}
      >
        {selectorOptions["animate"]?.map((dir) => (
          <option value={dir.value} key={dir.value}>
            {dir.label}
          </option>
        ))}
      </select>
      <select
        id="expressionSelector"
        value={selectorStates["expression"]?.value}
        onChange={(e) => {
          handleExpressionChange(e);
          setSelectorState("expression", {
            selectedIndex: Number(e.target.selectedIndex),
            value: e.target.value,
          });
        }}
      >
        {selectorOptions["expression"]?.map((dir) => (
          <option value={dir.value} key={dir.value}>
            {dir.label}
          </option>
        ))}
      </select>
      <select
        id="settingSelector"
        onChange={(e) => {
          setCurrentSetting(e.target.value);
          resetSettingUI();
        }}
        value={setting}
      >
        <option id="parameters" value="parameters">
          {t("parameters")}
        </option>
        <option id="parts" value="parts">
          {t("parts")}
        </option>
        <option id="drawables" value="drawables">
          {t("drawables")}
        </option>
        <option id="attachments" value="attachments">
          {t("attachments")}
        </option>
        <option id="skins" value="skins">
          {t("skins")}
        </option>
      </select>
      <div className="item" id="pmaDiv">
        <label title="premultipliedAlpha">
          <span>{t("premultipliedAlpha")}</span>
          <input
            type="checkbox"
            onChange={(e) => {
              handlePMACheckboxChange(e);
            }}
          />
        </label>
      </div>
      <input
        type="text"
        id="filterBox"
        placeholder={t("filter")}
        autoComplete="off"
        onChange={(e) => {
          handleFilterInput(e);
        }}
      />
      <div
        id="setting"
        onInput={(e) => {
          handleSettingChange(e);
        }}
      >
        <div id="parameter"></div>
        <div id="part"></div>
        <div id="drawable"></div>
        <div id="attachment"></div>
        <div id="skin"></div>
      </div>
    </div>
  );
};

export default Sidebar;
