import React from "react";
import { useTranslation } from "react-i18next";
import {
  findMaxNumberInString,
  handleLive2DAnimationChange,
  handleSpineAnimationChange,
  navigateAndTriggerChange,
} from "./js/events";
import { useAtom } from "jotai";
import {
  getFile,
  isModelType,
  modelTypeAtom,
  setCurrentSetting,
  settingAtom,
} from "./store";
import {
  selectorOptionsAtom,
  selectorStatesAtom,
  setSelectorState,
} from "./store/selectors";
import { addKeyboardListener } from "./keyboard";
import { dispose, init, populateSceneSelector, resetSettingUI } from "./utils";
import SpineSettings from "./SpineSettings";
import Live2dSetting from "./Live2dSetting";
import { currentModel } from "./js/live2d-loader";
import { createAttachments } from "./store/spine";

type Selected = {
  selectedIndex: number;
  value: string;
};

function handleAnimationChange(selected: Selected) {
  setSelectorState("animate", selected);

  if (isModelType("live2d")) {
    const [motion, index] = selected.value.split(",");
    handleLive2DAnimationChange(motion, index);
  } else {
    handleSpineAnimationChange(selected.selectedIndex);
    createAttachments();
  }
}

function handleExpressionChange(selected: Selected) {
  setSelectorState("expression", selected);

  currentModel.expression(
    "" === selected.value
      ? currentModel.internalModel.motionManager.ExpressionManager
          ?.defaultExpression
      : Number(selected.value),
  );
}

function handleSceneChange(selected: Partial<Selected>) {
  setSelectorState("scene", selected);
  dispose();
  init();
}

function handleDirChange(selected: Selected) {
  setSelectorState("dir", selected);

  // change related scene
  const sceneIds = getFile(selected.value);
  const maxNumber = findMaxNumberInString(selected.value);
  populateSceneSelector(sceneIds);
  const index = Math.max(
    sceneIds.findIndex((item) => item.includes(maxNumber as any)),
    0,
  );
  handleSceneChange({ selectedIndex: index });
}

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [selectorOptions] = useAtom(selectorOptionsAtom);
  const [selectorStates] = useAtom(selectorStatesAtom);
  const [setting] = useAtom(settingAtom);
  const [modelType] = useAtom(modelTypeAtom);

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

  React.useEffect(() => {
    resetSettingUI();
  }, [setting]);

  return (
    <div id="sidebar" ref={rootRef}>
      <select
        value={selectorStates["dir"]?.value}
        onChange={(e) => {
          handleDirChange({
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
          handleSceneChange({
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
      {selectorOptions["animate"]?.length > 0 && (
        <select
          id="animationSelector"
          value={selectorStates["animate"]?.value}
          onChange={(e) => {
            handleAnimationChange({
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
      )}
      {modelType === "live2d" && selectorOptions["expression"]?.length > 0 && (
        <select
          value={selectorStates["expression"]?.value}
          onChange={(e) => {
            handleExpressionChange({
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
      )}
      <select
        id="settingSelector"
        onChange={(e) => {
          setCurrentSetting(e.target.value);
        }}
        value={setting}
        ref={(ref) => {
          if (!ref) return;
          if (!setting) {
            setCurrentSetting(ref.options[0].value);
          }
        }}
      >
        {modelType === "live2d" ? (
          <>
            <option id="parameters" value="parameters">
              {t("parameters")}
            </option>
            <option id="parts" value="parts">
              {t("parts")}
            </option>
            <option id="drawables" value="drawables">
              {t("drawables")}
            </option>
          </>
        ) : (
          <>
            <option id="attachments" value="attachments">
              {t("attachments")}
            </option>
            <option id="skins" value="skins">
              {t("skins")}
            </option>
          </>
        )}
      </select>
      {modelType === "live2d" && <Live2dSetting />}
      {modelType === "spine" && <SpineSettings />}
    </div>
  );
};

export default Sidebar;
