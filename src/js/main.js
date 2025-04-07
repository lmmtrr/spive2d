import {
  dirSelector,
  resetAttachmentsCache,
  resetValues,
  sceneSelector,
} from "./events.js";
import { disposeLive2D, loadLive2DModel } from "./live2d-loader.js";
import { disposeSpine, loadSpineModel } from "./spine-loader.js";
import { createDirSelector, createSceneSelector } from "./ui.js";
const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

export let dirFiles;
export let isInit = false;
let isProcessing = false;
export const spines = {};
export let modelType = "live2d";
const versions = ["3.6", "3.7", "3.8", "4.0", "4.1", "4.2"];
preloadSpines(versions);

const spinner = document.getElementById("spinner");

function preloadSpines(versions) {
  for (const version of versions) {
    const script = document.createElement("script");
    script.src = `lib/spine-webgl-${version}.js`;
    script.onload = () => {
      if (version[0] === "3") Object.assign(window.spine, window.spine.webgl);
      spines[version] = window.spine;
      window.spine = undefined;
      script.remove();
    };
    document.head.appendChild(script);
  }
}

export function splitExt(fileName) {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return [fileName, ""];
  }
  const name = fileName.slice(0, lastDotIndex);
  const ext = fileName.slice(lastDotIndex);
  return [name, ext];
}

export function init() {
  const dirName = dirSelector[dirSelector.selectedIndex].value;
  const _fileName = `${dirName}/${
    dirFiles[dirName][sceneSelector.selectedIndex]
  }`;
  const splitFileName = splitExt(_fileName);
  const fileName = splitFileName[0];
  const ext = splitFileName[1];
  if (ext.includes("moc")) {
    modelType = "live2d";
    loadLive2DModel(fileName, ext);
  } else {
    modelType = "spine";
    loadSpineModel(fileName, ext);
  }
  resetValues();
}

export function dispose() {
  if (modelType === "live2d") disposeLive2D();
  else disposeSpine();
}

listen("progress", (event) => {
  isProcessing = event.payload;
  if (isProcessing) {
    spinner.style.display = "block";
  } else {
    spinner.style.display = "none";
  }
});

listen("tauri://drag-drop", async (event) => {
  if (isProcessing) return;
  isInit = false;
  const droppedPaths = event.payload.paths;
  if (droppedPaths.length === 1) {
    const droppedPath = droppedPaths[0];
    try {
      const _dirFiles = await invoke("handle_dropped_path", {
        path: droppedPath,
      });
      const dirs = Object.keys(_dirFiles);
      dirs.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      dirFiles = _dirFiles;
      const sceneIds = _dirFiles[dirs[0]];
      if (dirs.length > 0) {
        createDirSelector(dirs);
        createSceneSelector(sceneIds);
        resetAttachmentsCache();
        dispose();
        init();
        isInit = true;
      }
    } catch (error) {
      console.error("Error handling dropped path:", error);
      spinner.style.display = "none";
    }
  }
});
