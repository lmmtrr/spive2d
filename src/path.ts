import {
  isInitialized,
  isProcessing,
  setFiles,
  setInitialize,
  setSpinnerVisible,
} from "./store";
import { getSelectorCurrentState } from "./store/selectors";
import { open } from "@tauri-apps/plugin-dialog";
import { join, dirname, downloadDir } from "@tauri-apps/api/path";
import { openPath } from "@tauri-apps/plugin-opener";
import { invoke } from "@tauri-apps/api/core";
import { getSortableKey } from "./utils/sort";
import {
  dispose,
  init,
  notify,
  populateDirSelector,
  populateSceneSelector,
} from "./utils";
import { resetAttachmentsCache } from "./js/events";
import { setGlobalSetting } from "./store/settings";

export async function processPath(paths: string[]) {
  if (isProcessing()) return;

  setInitialize(false);
  if (paths.length === 1) {
    const path = paths[0];
    try {
      // XXX: this will find all files with associated extensions .skel/.json/.atlas/moc3
      const _dirFiles = await invoke<any>("handle_dropped_path", {
        path: path,
      });

      const dirs = Object.keys(_dirFiles).sort((a, b) => {
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
      } else {
        notify.info(
          `no such spine(.skel/.json and .atlas should be same name) or live2d(.moc3/.cmo3) files in "${path}".`,
        );
      }
    } catch (error) {
      notify.error("Error handling dropped path:", error);
      setSpinnerVisible(false);
    }
  }
}

export async function handleOpenDirectory() {
  const file = await open({
    multiple: false,
    directory: true,
  });
  if (file) processPath([file]);
}

export async function handleOpenArchiveFile() {
  const file = await open({
    multiple: false,
    filters: [
      {
        name: "Archive",
        extensions: ["zip", "7z"],
      },
    ],
  });
  if (file) processPath([file]);
}

export async function handleOpenCurrentDirectory() {
  if (!isInitialized()) return;
  const isWindows = navigator.userAgent.includes("Windows");
  const currentDir = getSelectorCurrentState("dir").selected.value;
  const sceneId = getSelectorCurrentState("scene").selected.value;
  const path = await join(currentDir, sceneId);
  const dir = await dirname(path);
  if (isWindows) await openPath(dir.replace(/\//g, "\\"));
  else await openPath(dir);
}

export async function handleOpenExportDirectory() {
  const isWindows = navigator.userAgent.includes("Windows");
  const dir = await downloadDir();
  if (isWindows) await openPath(dir.replace(/\//g, "\\"));
  else await openPath(dir);
}
