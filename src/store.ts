import { atom, getDefaultStore } from "jotai";
import { useSimpleAtom } from "./jotai-extended";
import type { ExtractAtomValue } from "jotai";

export const jotaiStore = getDefaultStore();
export const [isInitialized, setInitialize, isInitAtom] = useSimpleAtom(
  atom(false),
  jotaiStore,
);

export const [getModelType, setModelType] = useSimpleAtom(
  atom<"live2d" | "spine">("live2d"),
  jotaiStore,
);
export const isModelType = (model: string) => getModelType() === model;

export const [isSpinnerVisible, setSpinnerVisible, spinnerStateAtom] =
  useSimpleAtom(atom(false), jotaiStore);

export const [getCurrentSetting, setCurrentSetting, settingAtom] =
  useSimpleAtom(atom(""), jotaiStore);

export const selectorOptionsAtom = atom<
  Record<string, { label: string; value: any }[]>
>({});
export const setSelectorOptions = <T>(
  selector: string,
  items: T[],
  valueMapper?: (item: T) => any,
  textMapper?: (item: T) => any,
  initialOptions: { label: string; value: any }[] = [],
) => {
  const options = items.map((item) => ({
    label: textMapper?.(item),
    value: valueMapper?.(item),
  }));

  jotaiStore.set(selectorOptionsAtom, {
    ...jotaiStore.get(selectorOptionsAtom),
    [selector]: initialOptions.concat(options),
  });
};
export const selectorStatesAtom = atom<
  Record<string, { selectedIndex: number; value: any }>
>({});
export const setSelectorState = <S extends string>(
  selector: S,
  state: Partial<ExtractAtomValue<typeof selectorStatesAtom>[S]>,
) => {
  const snapshot = jotaiStore.get(selectorStatesAtom);
  const options = jotaiStore.get(selectorOptionsAtom)[selector];
  const index =
    state.selectedIndex ??
    options.findIndex((op) => op.value === state.value) ??
    snapshot[selector].selectedIndex ??
    0;
  const value =
    state.value ??
    options[state.selectedIndex ?? 0] ??
    snapshot[selector].value ??
    "";

  jotaiStore.set(selectorStatesAtom, {
    ...snapshot,
    [selector]: {
      selectedIndex: index,
      value: value,
    },
  });
};
export const getSelectorState = (selector: string) =>
  jotaiStore.get(selectorStatesAtom)[selector];
export const getSelectorCurrentState = (selector: string) => {
  const options = jotaiStore.get(selectorOptionsAtom)[selector];
  const states = getSelectorState(selector);

  return {
    selected: options[states.selectedIndex ?? 0],
    options,
    states,
  };
};

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
