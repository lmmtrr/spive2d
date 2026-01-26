import { atom, type ExtractAtomValue } from "jotai";
import { jotaiStore } from "./store";

export const selectorOptionsAtom = atom<
  Record<string, { label: string; value: any }[]>
>({});
export const selectorStatesAtom = atom<
  Record<string, { selectedIndex: number; value: any }>
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
  jotaiStore.set(selectorStatesAtom, {
    ...jotaiStore.get(selectorStatesAtom),
    [selector]: {
      selectedIndex: 0,
      value: options[0].value,
    },
  });
};

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

  console.log(selector, options, states);

  return {
    selected: options[states.selectedIndex ?? 0],
    options,
    states,
  };
};
