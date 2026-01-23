import {
  isInitialized,
  getSelectorCurrentState,
} from "./store";
import { processPath } from "./utils.js";
import { open } from "@tauri-apps/plugin-dialog";
import { join, dirname, downloadDir } from "@tauri-apps/api/path";
import { openPath } from "@tauri-apps/plugin-opener";

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
