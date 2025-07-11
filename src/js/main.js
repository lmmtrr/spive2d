import {
  dirSelector,
  resetAttachmentsCache,
  resetConfiguration,
  resetModelState,
  sceneSelector,
} from "./events.js";
import { disposeLive2D, loadLive2DModel } from "./live2d-loader.js";
import { disposeSpine, loadSpineModel } from "./spine-loader.js";
import { createDirSelector, createSceneSelector, getSortableKey } from "./ui.js";
const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

const spinner = document.getElementById("spinner");
const dialog = document.getElementById("dialog");
const windowWidth = document.getElementById("windowWidth");
const windowHeight = document.getElementById("windowHeight");
const aspectRatioToggle = document.getElementById("aspectRatioToggle");

export let dirFiles;
export let isInit = false;
export let isProcessing = false;
export const spines = {};
export let modelType = "live2d";
const versions = ["3.6", "3.7", "3.8", "4.0", "4.1", "4.2"];
preloadSpines(versions);
windowWidth.value = window.innerWidth;
windowHeight.value = window.innerHeight;
aspectRatioToggle.value = window.innerHeight / window.innerWidth;
dialog.showModal();

export function setProcessing(status) {
  isProcessing = status;
}

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

export function init() {
  const dirName = dirSelector[dirSelector.selectedIndex].value;
  const fileNames = dirFiles[dirName][sceneSelector.selectedIndex];
  const ext = fileNames[1];
  if (ext.includes(".moc")) {
    modelType = "live2d";
    loadLive2DModel(dirName, fileNames);
  } else {
    modelType = "spine";
    loadSpineModel(dirName, fileNames);
  }
  resetConfiguration();
  resetModelState();
}

export function dispose() {
  if (modelType === "live2d") disposeLive2D();
  else disposeSpine();
}

export async function processPath(paths) {
  if (isProcessing) return;
  isInit = false;
  if (paths.length === 1) {
    const path = paths[0];
    try {
      const _dirFiles = await invoke("handle_dropped_path", {
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
      dirFiles = _dirFiles;
      const sceneIds = _dirFiles[dirs[0]];
      if (dirs.length > 0) {
        createDirSelector(dirs);
        createSceneSelector(sceneIds);
        resetAttachmentsCache();
        dispose();
        init();
        isInit = true;
        dialog.close();
      }
    } catch (error) {
      console.error("Error handling dropped path:", error);
      spinner.style.display = "none";
    }
  }
}

listen("progress", (event) => {
  setProcessing(event.payload);
  spinner.style.display = event.payload ? "block" : "none";
});

listen("tauri://drag-drop", async (event) => {
  processPath(event.payload.paths);
});