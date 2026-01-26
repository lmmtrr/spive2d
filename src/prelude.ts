import { processPath } from "./utils";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import { listen } from "@tauri-apps/api/event";
import { setSpinnerVisible, setProcessing, setSpine } from "./store";
import { handleKeyboardInput } from "./keyboard";
import {
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleMouseUp,
  handleResize,
  handleWheel,
} from "./mouse";

const SpineVersions = ["3.6", "3.7", "3.8", "4.0", "4.1", "4.2"] as const;

export function preloadSpines() {
  for (const version of SpineVersions) {
    const script = document.createElement("script");
    script.src = `/lib/spine-webgl-${version}.js`;
    script.onload = () => {
      if (version[0] === "3")
        // @ts-ignore
        Object.assign(window.spine, window.spine.webgl);
      setSpine(
        version,
        // @ts-ignore
        window.spine,
      );
      // @ts-ignore
      window.spine = undefined;
      script.remove();
    };
    document.head.appendChild(script);
  }
}

export function setupI18n() {
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      debug: true,
      resources: {
        en,
        zh,
      },
      supportedLngs: ["zh", "en"],
      fallbackLng: "en",
      interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
      },
    });
}

export function setupIpc() {
  listen<boolean>("progress", (event) => {
    setProcessing(event.payload);
    setSpinnerVisible(event.payload);
  });

  listen<{ paths: any[] }>("tauri://drag-drop", async (event) => {
    processPath(event.payload.paths);
  });
}

export function setupWebListeners() {
  window.addEventListener("contextmenu", (e) => e.preventDefault());

  document.addEventListener("keydown", handleKeyboardInput);

  window.addEventListener("resize", handleResize);

  document.addEventListener("mouseout", handleMouseOut);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("wheel", handleWheel);
}
