import React from "react";
import { useTranslation } from "react-i18next";
import { resetModelState } from "./model-transform";
import { open } from "@tauri-apps/plugin-dialog";
import { useAtom } from "jotai";
import { isInitialized, isModelType } from "./store";
import {
  globalSettingsAtom,
  getGlobalSetting,
  setGlobalSetting,
} from "./store/settings";
import { getCurrentWindow, PhysicalSize } from "@tauri-apps/api/window";
import {
  handleOpenArchiveFile,
  handleOpenCurrentDirectory,
  handleOpenDirectory,
  handleOpenExportDirectory,
} from "./path";
import { convertFileSrc } from "@tauri-apps/api/core";
import { addKeyboardListener, removeKeyboardListener } from "./keyboard";
import { currentModel } from "./js/live2d-loader.js";
import { skeletons } from "./js/spine-loader.js";

function setBodyBackgroundImage(uri: string) {
  document.body.style.backgroundColor = "";
  document.body.style.backgroundImage = `url("${uri}")`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}
function setBodyBackgroundColor(color: string) {
  document.body.style.backgroundColor = color;
  document.body.style.backgroundImage = "none";
}
function resetBodyBackgroundImage() {
  document.body.style.backgroundColor = "";
  document.body.style.backgroundImage = `
    linear-gradient(45deg, #fff 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #fff 0),
    linear-gradient(45deg, #fff 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #fff 0)`;
  document.body.style.backgroundSize = "32px 32px";
  document.body.style.backgroundPosition =
    "0 0, 16px 16px, 16px 16px, 32px 32px";
}

const Dialog: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [settings] = useAtom(globalSettingsAtom);

  function handleLanguageSelectorChange(e: { target: { value: string } }) {
    const lang = e.target.value;
    localStorage.setItem("spive2d_language", lang);
    i18n.changeLanguage(lang);
  }

  function toggleDialog() {
    if (getGlobalSetting("settingDialogOpen")) {
      setGlobalSetting("settingDialogOpen", false);
    } else {
      setGlobalSetting("settingDialogOpen", true);
      if (!isInitialized()) return;
      if (isModelType("live2d")) {
        setGlobalSetting(
          "originalWidth",
          currentModel.internalModel.originalWidth,
        );
        setGlobalSetting(
          "originalHeight",
          currentModel.internalModel.originalHeight,
        );
      } else if (isModelType("spine")) {
        // @ts-ignore
        setGlobalSetting("originalWidth", skeletons["0"].skeleton.data.width);
        // @ts-ignore
        setGlobalSetting("originalHeight", skeletons["0"].skeleton.data.height);
      }
    }
  }

  React.useEffect(() => {
    addKeyboardListener("e", toggleDialog);

    const savedLang = localStorage.getItem("spive2d_language") || "en";
    handleLanguageSelectorChange({ target: { value: savedLang } });

    return () => {
      removeKeyboardListener("e");
    };
  }, []);

  React.useEffect(() => {
    const dialog = document.getElementById("dialog")! as HTMLDialogElement;
    if (settings.settingDialogOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [settings.settingDialogOpen]);

  return (
    <dialog
      id="dialog"
      closedby="any"
      autoFocus
      onClose={() => {
        setGlobalSetting("settingDialogOpen", false);
      }}
    >
      <label className="input-row">
        <span>{t("language")}</span>
        <select
          value={i18n.language}
          onChange={(e) => {
            console.log(i18n.language, e.target.value, e);
            handleLanguageSelectorChange(e);
          }}
        >
          {(i18n.options.supportedLngs as string[])
            // debug mode
            .filter((lang) => lang !== "cimode")
            ?.map((lang) => (
              <option value={lang} key={lang}>
                {/* Prevent triggering onchange("English") from due to the "e" key being pressed */}
                &#8203;
                {t("languages." + lang)}
              </option>
            ))}
        </select>
      </label>
      <hr />
      <div className="button-group">
        <button onClick={handleOpenDirectory}>{t("openDirectory")}</button>
        <button onClick={handleOpenArchiveFile}>{t("openArchive")}</button>
        <button onClick={handleOpenCurrentDirectory}>
          {t("openCurrentDirectory")}
        </button>
        <button onClick={handleOpenExportDirectory}>
          {t("openExportDirectory")}
        </button>
      </div>
      <hr />
      <div className="button-group">
        <button
          onClick={async function () {
            const file = await open({
              multiple: false,
              filters: [
                {
                  name: "Images",
                  extensions: ["jpg", "jpeg", "png", "gif", "webp"],
                },
              ],
            });
            if (!file) return;
            setBodyBackgroundImage(convertFileSrc(file));
          }}
        >
          {t("openImage")}
        </button>
        <button onClick={resetBodyBackgroundImage}>{t("removeImage")}</button>
      </div>
      <label className="input-row">
        <span>{t("backgroundColor")}</span>
        <input
          type="color"
          onChange={(e) => setBodyBackgroundColor(e.target.value)}
        />
      </label>
      <hr />
      <label title={settings.aspectRatio.toString()}>
        <input
          type="checkbox"
          checked={settings.aspectRatioEnabled}
          onChange={(e) => {
            setGlobalSetting("aspectRatioEnabled", e.target.checked);
          }}
        />
        <span>{t("keepAspectRatio")}</span>
      </label>
      <label className="input-row">
        <span>{t("windowWidth")}</span>
        <input
          type="number"
          id="windowWidth"
          min="100"
          max="10000"
          value={settings.windowWidth}
          onChange={(e) => {
            let newWidth = Number(e.target.value);
            if (settings.aspectRatioEnabled) {
              setGlobalSetting(
                "windowHeight",
                Math.round(newWidth * settings.aspectRatio),
              );
            }
            if (newWidth < 100) newWidth = 100;
            if (newWidth > 10000) newWidth = 10000;
            if (settings.windowHeight < 100)
              setGlobalSetting("windowHeight", 100);
            if (settings.windowHeight > 10000)
              setGlobalSetting("windowHeight", 10000);

            newWidth = Math.round(newWidth);
            const newHeight = Math.round(settings.windowHeight);
            getCurrentWindow().setSize(new PhysicalSize(newWidth, newHeight));
            setGlobalSetting("aspectRatio", newHeight / newWidth);
          }}
        />
      </label>
      <label className="input-row">
        <span>{t("windowHeight")}</span>
        <input
          type="number"
          name="windowHeight"
          min="100"
          max="10000"
          value={settings.windowHeight}
          onChange={(e) => {
            let newHeight = Number(e.target.value);
            if (settings.aspectRatioEnabled) {
              setGlobalSetting(
                "windowWidth",
                Math.round(newHeight / settings.aspectRatio),
              );
            }
            if (settings.windowWidth < 100)
              setGlobalSetting("windowWidth", 100);
            if (settings.windowWidth > 10000)
              setGlobalSetting("windowWidth", 10000);
            if (newHeight < 100) newHeight = 100;
            if (newHeight > 10000) newHeight = 10000;
            const newWidth = Math.round(settings.windowWidth);
            newHeight = Math.round(newHeight);
            getCurrentWindow().setSize(new PhysicalSize(newWidth, newHeight));
            setGlobalSetting("aspectRatio", newHeight / newWidth);
          }}
        />
      </label>
      <label className="input-row">
        <span>{t("originalWidth")}</span>
        <input
          type="text"
          name="originalWidth"
          readOnly
          value={settings.originalWidth}
        />
      </label>
      <label className="input-row">
        <span>{t("originalHeight")}</span>
        <input
          type="text"
          name="originalHeight"
          readOnly
          value={settings.originalHeight}
        />
      </label>
      <div className="button-group">
        <button
          onClick={async function () {
            if (!isInitialized()) return;
            const originalWidth = Math.round(settings.originalWidth!);
            const originalHeight = Math.round(settings.originalHeight!);
            await getCurrentWindow().setSize(
              new PhysicalSize(originalWidth, originalHeight),
            );
            resetModelState();
          }}
        >
          {t("setOriginalSize")}
        </button>
        <button onClick={resetModelState}>{t("resetState")}</button>
      </div>
      <label>
        <input
          type="checkbox"
          checked={settings.exportAsOriginalSize}
          onChange={(e) => {
            setGlobalSetting("exportAsOriginalSize", e.target.checked);
          }}
        />
        <span>{t("exportOriginalSize")}</span>
      </label>
    </dialog>
  );
};

export default Dialog;
