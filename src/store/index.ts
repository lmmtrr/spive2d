import { atom } from "jotai";
import { jotaiStore, useSimpleAtom } from "./store";

export const subscribe = (...params: Parameters<typeof jotaiStore.sub>) =>
  jotaiStore.sub(...params);

export const [isInitialized, setInitialize, isInitAtom] = useSimpleAtom(
  atom(false),
  jotaiStore,
);

export const [getModelType, setModelType, modelTypeAtom] = useSimpleAtom(
  atom<"live2d" | "spine">("live2d"),
  jotaiStore,
);
export const isModelType = (model: string) => getModelType() === model;

export const [isSpinnerVisible, setSpinnerVisible, spinnerStateAtom] =
  useSimpleAtom(atom(false), jotaiStore);

export const [getCurrentSetting, setCurrentSetting, settingAtom] =
  useSimpleAtom(atom(""), jotaiStore);

export const [isProcessing, setProcessing] = useSimpleAtom(
  atom(false),
  jotaiStore,
);

export const SpineVersions = [
  "3.6",
  "3.7",
  "3.8",
  "4.0",
  "4.1",
  "4.2",
] as const;

type Spine = (typeof SpineVersions)[number];

const spines: Map<Spine, any> = new Map();
export const getSpine = (version: Spine) => {
  return spines.get(version);
};
export const setSpine = (version: Spine, spine: any) => {
  spines.set(version, spine);
};

let dirFiles: Record<string, string[][]> = {};
export const setFiles = (files: typeof dirFiles) => {
  dirFiles = files;
};
export const getFile = (dirname: string) => {
  return dirFiles[dirname];
};

let firstRender = true;
export const isFirstRender = () => firstRender;
export function setFirstRenderFlag(flag: boolean) {
  firstRender = flag;
}
