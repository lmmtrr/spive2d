import { atom, type ExtractAtomValue } from "jotai";
import { jotaiStore } from "./store";

export const globalSettingsAtom = atom<{
  settingDialogOpen: boolean;
  windowWidth: number;
  windowHeight: number;
  aspectRatioEnabled: boolean;
  aspectRatio: number;
  originalWidth?: number;
  originalHeight?: number;
  exportAsOriginalSize: boolean;
}>({
  settingDialogOpen: true,
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  aspectRatioEnabled: false,
  exportAsOriginalSize: false,
  aspectRatio: window.innerHeight / window.innerWidth,
});

export const getGlobalSetting = <
  S extends keyof ExtractAtomValue<typeof globalSettingsAtom>,
>(
  setting: S,
): ExtractAtomValue<typeof globalSettingsAtom>[S] =>
  jotaiStore.get(globalSettingsAtom)[setting];

export const setGlobalSetting = <
  S extends keyof ExtractAtomValue<typeof globalSettingsAtom>,
>(
  setting: S,
  value: ExtractAtomValue<typeof globalSettingsAtom>[S],
) =>
  jotaiStore.set(globalSettingsAtom, {
    ...jotaiStore.get(globalSettingsAtom),
    [setting]: value,
  });
