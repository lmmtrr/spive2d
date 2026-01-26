import { handleFilterInput } from "./js/events";
import { disposeLive2D, loadLive2DModel } from "./js/live2d-loader";
import { disposeSpine, loadSpineModel } from "./js/spine-loader";
import {
  getCurrentSetting,
  getFile,
  isModelType,
  setCurrentSetting,
  setFirstRenderFlag,
  setModelType,
} from "./store";
import {
  setSelectorOptions,
  getSelectorCurrentState,
  getSelectorState,
} from "./store/selectors";
import { resetModelState } from "./model-transform";
import { sortByText } from "./utils/sort";
import { createDrawables, createParameters, createParts } from "./store/live2d";
import { createAttachments, createSkins } from "./store/spine";

export const populateDirSelector = (dirs: string[]) => {
  setSelectorOptions(
    "dir",
    dirs,
    (dir) => dir,
    (dir) => dir.split("/").filter(Boolean).pop(),
  );
};
export function populateSceneSelector(sceneIds: string[]) {
  setSelectorOptions(
    "scene",
    sceneIds,
    (scenePath) => scenePath[0],
    (scenePath) => scenePath[0].split("/").filter(Boolean).pop(),
  );
}
export function populateAnimateSelector(animations: any[]) {
  if (isModelType("live2d")) {
    const displayableAnimations = Object.entries(animations)
      .flatMap(([groupName, anims]) =>
        (anims as any[]).map((anim, originalIndex) => ({
          text: (anim.file || anim.File || "").split("/").pop(),
          value: `${groupName},${originalIndex}`,
        })),
      )
      .sort(sortByText);
    setSelectorOptions(
      "animate",
      displayableAnimations,
      (anim) => anim.value,
      (anim) => anim.text,
    );
  } else if (isModelType("spine")) {
    setSelectorOptions(
      "animate",
      animations,
      (v) => v.name,
      (v) => v.name,
    );
  }
}
export function populateExpressionSelector(expressions: any[]) {
  if (isModelType("live2d")) {
    const displayableExpressions = expressions
      .map((expr, originalIndex) => ({
        text: (expr.file || expr.File || "").split("/").pop(),
        value: String(originalIndex),
      }))
      .sort(sortByText);
    setSelectorOptions(
      "expression",
      displayableExpressions,
      (expr) => expr.value,
      (expr) => expr.text,
      [{ label: "Default", value: "" }],
    );
  }
}

export function dispose() {
  if (isModelType("live2d")) disposeLive2D();
  else disposeSpine();
}

function resetConfiguration() {
  const settingSelector = document.getElementById(
    "settingSelector",
  )! as HTMLSelectElement;

  setFirstRenderFlag(true);
  if (isModelType("live2d")) {
    setCurrentSetting("parameters");
  } else {
    setCurrentSetting("attachments");
  }
  settingSelector.disabled = false;
}

export function init() {
  const dirName = getSelectorCurrentState("dir").selected.value;
  const fileNames = getFile(dirName)[getSelectorState("scene").selectedIndex];
  const ext = fileNames[1];
  if (ext.includes(".moc")) {
    setModelType("live2d");
    loadLive2DModel(dirName, fileNames);
  } else {
    setModelType("spine");
    loadSpineModel(dirName, fileNames);
  }
  resetConfiguration();
  resetModelState();
}

export function resetUI() {
  if (isModelType("live2d")) {
    createParameters();
    createParts();
    createDrawables();
  } else if (isModelType("spine")) {
    createAttachments();
    createSkins();
  }
  const settingElement = document.getElementById("setting");
  if (settingElement) {
    settingElement.scrollTop = 0;
  }
  handleFilterInput();
}

export function resetSettingUI() {
  const panelMap = {
    parameters: document.getElementById("parameter"),
    parts: document.getElementById("part"),
    drawables: document.getElementById("drawable"),
    attachments: document.getElementById("attachment"),
    skins: document.getElementById("skin"),
  };
  Object.entries(panelMap).forEach(([pk, panel]) => {
    if (!panel) return;
    if (pk === getCurrentSetting()) panel.style.display = "block";
    else panel.style.display = "none";
  });
}
