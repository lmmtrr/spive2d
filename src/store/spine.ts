import { atom } from "jotai";
import { jotaiStore } from "./store";
import { skeletons } from "../js/spine-loader";
import { attachmentsCache } from "../js/events";
import { sortByName } from "../utils/sort";

export const skinsAtom = atom<any[]>([]);
export const attachmentsAtom = atom<any[]>([]);

export function createSkins() {
  const settingSelector = document.getElementById(
    "settingSelector",
  )! as HTMLSelectElement;
  // @ts-ignore
  const skins: any[] = skeletons["0"].skeleton.data.skins;
  if (skins.length <= 1) {
    settingSelector.disabled = true;
    return;
  }
  settingSelector.disabled = false;
  const skinData = skins.slice(1).map((skin) => [skin.name, -1]);
  jotaiStore.set(skinsAtom, skinData);
}

export function createAttachments() {
  // @ts-ignore
  const skeleton = skeletons["0"]?.skeleton;
  if (!skeleton) return;
  const attachmentSet = new Map();
  (skeleton.slots as any[]).forEach((slot, index) => {
    if (slot.attachment) {
      attachmentSet.set(slot.attachment.name, index);
    }
  });
  for (const name in attachmentsCache) {
    if (!attachmentSet.has(name)) {
      // @ts-ignore
      const [index] = attachmentsCache[name];
      attachmentSet.set(name, index);
    }
  }
  const allAttachments = Array.from(attachmentSet.entries()).sort(sortByName);
  jotaiStore.set(attachmentsAtom, allAttachments);
}
