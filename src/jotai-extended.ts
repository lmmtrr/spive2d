import type { Store } from "jotai/vanilla/store";
import type { SetStateAction, WritableAtom } from "jotai";
import { getDefaultStore } from "jotai";

export const useSimpleAtom = <T>(
  atom: WritableAtom<T, [SetStateAction<T>], void>,
  store: Store = getDefaultStore(),
) => {
  return [
    () => store.get(atom),
    (state: T) => store.set(atom, state),
    atom,
  ] as const;
};
