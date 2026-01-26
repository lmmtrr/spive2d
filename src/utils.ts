import { resetAttachmentsCache, resetConfiguration } from "./js/events";
import { disposeLive2D, loadLive2DModel } from "./js/live2d-loader";
import { disposeSpine, loadSpineModel } from "./js/spine-loader";
import { invoke } from "@tauri-apps/api/core";
import {
  getFile,
  isModelType,
  isProcessing,
  setFiles,
  setInitialize,
  setModelType,
  setSpinnerVisible,
} from "./store";
import { setGlobalSetting } from "./store/settings";
import {
  setSelectorOptions,
  getSelectorCurrentState,
  getSelectorState,
} from "./store/selectors";
import { resetModelState } from "./model-transform";
import { getSortableKey, sortByText } from "./utils/sort";

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

export async function processPath(paths: string[]) {
  if (isProcessing()) return;
  setInitialize(false);
  if (paths.length === 1) {
    const path = paths[0];
    try {
      const _dirFiles = await invoke<any>("handle_dropped_path", {
        path: path,
      });
      const dirs = Object.keys(_dirFiles);
      dirs.sort((a, b) => {
        const keyA = getSortableKey(a);
        const keyB = getSortableKey(b);
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      setFiles(_dirFiles);
      const sceneIds = _dirFiles[dirs[0]];
      if (dirs.length > 0) {
        populateDirSelector(dirs);
        populateSceneSelector(sceneIds);
        resetAttachmentsCache();
        dispose();
        init();
        setInitialize(true);
        setGlobalSetting("settingDialogOpen", false);
      }
    } catch (error) {
      console.error("Error handling dropped path:", error);
      setSpinnerVisible(false);
    }
  }
}
