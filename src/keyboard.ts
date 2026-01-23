import { exportAnimation, exportImage } from "./js/export";
import { isInitialized } from "./store";

const keydownListeners = new Map();
export function addKeyboardListener(keycode: string, callback: (e: KeyboardEvent) => void) {
  keydownListeners.set(keycode, callback);
}
export function removeKeyboardListener(keycode: string) {
  keydownListeners.delete(keycode);
}

function focusBody() {
  if (document.activeElement !== document.body) {
    // @ts-ignore
    document.activeElement?.blur();
    document.body.focus();
  }
}

export function handleKeyboardInput(e: KeyboardEvent) {
  const isInputFocused = document.activeElement?.matches("input");
  if (isInputFocused) return;

  keydownListeners.get(e.key)?.(e);
  if (!isInitialized()) return;
  switch (e.key) {
    case "d":
      exportImage();
      break;
    case "c":
      exportAnimation();
      break;
  }
  focusBody();
}
