import { exportImage, exportAnimation } from "./export.js";
import { animationStates, skeletons, spine } from "./spine-loader.js";
import {
  dispose,
  dirFiles,
  init,
  isInit,
  isProcessing,
  modelType,
  processPath,
} from "./main.js";
import { currentModel } from "./live2d-loader.js";
import { createSceneSelector, resetSettingUI, createAttachmentUI } from "./ui.js";
const { convertFileSrc } = window.__TAURI__.core;
const { open } = window.__TAURI__.dialog;
const { openPath } = window.__TAURI__.opener;
const { getCurrentWindow, PhysicalSize } = window.__TAURI__.window;

const scaleMax = 8;
const scaleMin = 0.5;
const rotateStep = 0.001;
export let scale = 1;
export let moveX = 0;
export let moveY = 0;
export let rotate = 0;
export let dirIndex = 0;
export let sceneIndex = 0;
let startX = 0;
let startY = 0;
let mouseDown = false;
let isMove = false;
export let isFirstRender = true;
export let premultipliedAlpha = false;
export let setting = "parameters";
export let attachmentsCache = {};
let opacities;

const rootStyles = getComputedStyle(document.documentElement);
const sidebarWidth = Number(
  rootStyles.getPropertyValue("--sidebar-width").replace("px", "")
);

const dialog = document.getElementById("dialog");
const sidebar = document.getElementById("sidebar");
const pmaCheckbox = document.getElementById("pmaCheckbox");
export const dirSelector = document.getElementById("dirSelector");
export const sceneSelector = document.getElementById("sceneSelector");
export const animationSelector = document.getElementById("animationSelector");
export const expressionSelector = document.getElementById("expressionSelector");
const settingSelector = document.getElementById("settingSelector");
const filterBox = document.getElementById("filterBox");
const settingDiv = document.getElementById("setting");
const skin = document.getElementById("skin");
const live2dCanvas = document.getElementById("live2dCanvas");
const spineCanvas = document.getElementById("spineCanvas");
const languageSelector = document.getElementById("languageSelector");
const openDirectoryButton = document.getElementById("openDirectoryButton");
const openArchiveButton = document.getElementById("openArchiveButton");
const openCurrentDirectoryButton = document.getElementById("openCurrentDirectoryButton");
const openExportDirectoryButton = document.getElementById("openExportDirectoryButton");
const openImageButton = document.getElementById("openImageButton");
const removeImageButton = document.getElementById("removeImageButton");
const bgColorPicker = document.getElementById("bgColorPicker");
const windowWidthInput = document.getElementById("windowWidth");
const windowHeightInput = document.getElementById("windowHeight");
const aspectRatioToggle = document.getElementById('aspectRatioToggle');
const originalWidthInput = document.getElementById("originalWidth");
const originalHeightInput = document.getElementById("originalHeight");
const setOriginalSizeButton = document.getElementById("setOriginalSizeButton");
const resetStateButton = document.getElementById("resetStateButton");
setupEventListeners();

export function setOpacities(value) {
  opacities = value;
}

export function setFirstRenderFlag(flag) {
  isFirstRender = flag;
}

export function resetConfiguration() {
  isFirstRender = true;
  if (modelType === "live2d") {
    setting = "parameters";
    settingSelector.value = "parameters";
  } else {
    setting = "attachments";
    settingSelector.value = "attachments";
  }
  settingSelector.disabled = false;
}

export function resetModelState() {
  scale = 1;
  moveX = 0;
  moveY = 0;
  rotate = 0;
  if (!isInit) return;
  if (modelType === "live2d") {
    const { innerWidth: w, innerHeight: h } = window;
    let _scale = Math.min(
      w / currentModel.internalModel.originalWidth,
      h / currentModel.internalModel.originalHeight
    );
    _scale *= scale;
    currentModel.scale.set(_scale);
    currentModel.position.set(w * 0.5, h * 0.5);
    currentModel.rotation = 0;
  }
}

export function setModelState(_scale, _moveX, _moveY, _rotate) {
  scale = _scale;
  moveX = _moveX;
  moveY = _moveY;
  rotate = _rotate;
}

function setupEventListeners() {
  window.addEventListener("contextmenu", (e) => e.preventDefault());
  window.addEventListener("resize", handleResize);
  document.addEventListener("keydown", handleKeyboardInput);
  document.addEventListener("mouseout", handleMouseOut);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("wheel", handleWheel);
  pmaCheckbox.addEventListener("change", handlePMACheckboxChange);
  dirSelector.addEventListener("change", handleDirChange);
  sceneSelector.addEventListener("change", handleSceneChange);
  animationSelector.addEventListener("change", handleAnimationChange);
  expressionSelector.addEventListener("change", handleExpressionChange);
  settingSelector.addEventListener("change", handleSettingSelectorChange);
  languageSelector.addEventListener("change", handleLanguageSelectorChange);
  filterBox.addEventListener("input", handleFilterInput);
  settingDiv.addEventListener("input", handleSettingChange);
  openDirectoryButton.addEventListener("click", handleOpenDirectory);
  openArchiveButton.addEventListener("click", handleOpenArchiveFile);
  openCurrentDirectoryButton.addEventListener("click", handleOpenCurrentDirectory);
  openExportDirectoryButton.addEventListener("click", handleOpenExportDirectory);
  openImageButton.addEventListener("click", handleOpenImage);
  removeImageButton.addEventListener("click", handleRemoveImage);
  bgColorPicker.addEventListener("input", handleColorPickerChange);
  windowWidthInput.addEventListener("change", handleWindowWidthChange);
  windowHeightInput.addEventListener("change", handleWindowHeightChange);
  setOriginalSizeButton.addEventListener("click", handleSetOriginalSize);
  resetStateButton.addEventListener("click", resetModelState);
}

const savedLang = localStorage.getItem("spive2d_language") || "en";
handleLanguageSelectorChange({ target: { value: savedLang } });

function navigateAndTriggerChange(selector, delta) {
  const optionsLength = selector.options.length;
  if (optionsLength === 1) return;
  let newIndex = (selector.selectedIndex + delta + optionsLength) % optionsLength;
  selector.selectedIndex = newIndex;
  selector.dispatchEvent(new Event("change"));
}

function previousDir() {
  navigateAndTriggerChange(dirSelector, -1);
}

function nextDir() {
  navigateAndTriggerChange(dirSelector, 1);
}

function previousScene() {
  navigateAndTriggerChange(sceneSelector, -1);
}

function nextScene() {
  navigateAndTriggerChange(sceneSelector, 1);
}

function previousAnimation() {
  navigateAndTriggerChange(animationSelector, -1);
}

function nextAnimation() {
  navigateAndTriggerChange(animationSelector, 1);
}

function toggleDialog() {
  if (dialog.open) {
    dialog.close();
  } else {
    dialog.showModal();
    if (!isInit) return;
    if (modelType === "live2d") {
      originalWidthInput.value = currentModel.internalModel.originalWidth;
      originalHeightInput.value = currentModel.internalModel.originalHeight;
    } else if (modelType === "spine") {
      originalWidthInput.value = skeletons["0"].skeleton.data.width;
      originalHeightInput.value = skeletons["0"].skeleton.data.height;
    }
  }
}

async function handleOpenDirectory() {
  const file = await open({
    multiple: false,
    directory: true,
  });
  if (file) processPath([file]);
}

async function handleOpenArchiveFile() {
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

async function handleOpenCurrentDirectory() {
  if (!isInit) return;
  const isWindows = navigator.userAgent.includes('Windows');
  const currentDir = dirSelector[dirSelector.selectedIndex].value;
  const sceneId = sceneSelector[sceneSelector.selectedIndex].value;
  const path = await window.__TAURI__.path.join(currentDir, sceneId);
  const dir = await window.__TAURI__.path.dirname(path);
  if (isWindows) await openPath(dir.replace(/\//g, "\\"));
  else await openPath(dir);
}

async function handleOpenExportDirectory() {
  const isWindows = navigator.userAgent.includes('Windows');
  const { downloadDir } = window.__TAURI__.path;
  const dir = await downloadDir();
  if (isWindows) await openPath(dir.replace(/\//g, "\\"));
  else await openPath(dir);
}

async function handleOpenImage() {
  const file = await open({
    multiple: false,
    filters: [
      { name: "Images", extensions: ["jpg", "jpeg", "png", "gif", "webp"] },
    ],
  });
  if (!file) return;
  document.body.style.backgroundColor = "";
  document.body.style.backgroundImage = `url("${convertFileSrc(file)}")`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
}

async function handleRemoveImage() {
  document.body.style.backgroundColor = "";
  document.body.style.backgroundImage = `
    linear-gradient(45deg, #fff 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #fff 0),
    linear-gradient(45deg, #fff 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #fff 0)`;
  document.body.style.backgroundSize = "32px 32px";
  document.body.style.backgroundPosition = "0 0, 16px 16px, 16px 16px, 32px 32px";
}

function handleColorPickerChange() {
  document.body.style.backgroundColor = bgColorPicker.value;
  document.body.style.backgroundImage = "none";
}

function handleWindowWidthChange() {
  if (aspectRatioToggle.checked) {
    const newWidth = Number(windowWidthInput.value);
    const aspectRatio = Number(aspectRatioToggle.value);
    windowHeightInput.value = Math.round(newWidth * aspectRatio);
  }
  if (windowWidthInput.value < 100) windowWidthInput.value = 100;
  if (windowWidthInput.value > 10000) windowWidthInput.value = 10000;
  if (windowHeightInput.value < 100) windowHeightInput.value = 100;
  if (windowHeightInput.value > 10000) windowHeightInput.value = 10000;
  const newWidth = Number(windowWidthInput.value);
  const newHeight = Number(windowHeightInput.value);
  getCurrentWindow().setSize(new PhysicalSize(newWidth, newHeight));
  aspectRatioToggle.value = newHeight / newWidth;
}

function handleWindowHeightChange() {
  if (aspectRatioToggle.checked) {
    const newHeight = Number(windowHeightInput.value);
    const aspectRatio = Number(aspectRatioToggle.value);
    windowWidthInput.value = Math.round(newHeight / aspectRatio);
  }
  if (windowWidthInput.value < 100) windowWidthInput.value = 100;
  if (windowWidthInput.value > 10000) windowWidthInput.value = 10000;
  if (windowHeightInput.value < 100) windowHeightInput.value = 100;
  if (windowHeightInput.value > 10000) windowHeightInput.value = 10000;
  const newWidth = Number(windowWidthInput.value);
  const newHeight = Number(windowHeightInput.value);
  getCurrentWindow().setSize(new PhysicalSize(newWidth, newHeight));
  aspectRatioToggle.value = newHeight / newWidth;
}

async function handleSetOriginalSize() {
  if (!isInit) return;
  const originalWidth = Math.round(Number(originalWidthInput.value));
  const originalHeight = Math.round(Number(originalHeightInput.value));
  await getCurrentWindow().setSize(new PhysicalSize(originalWidth, originalHeight));
  resetModelState();
}

function focusBody() {
  if (document.activeElement !== document.body) {
    document.activeElement.blur();
    document.body.focus();
  }
}

function handleKeyboardInput(e) {
  const isInputFocused = document.activeElement.matches("input");
  if (isInputFocused) return;
  if (e.key !== 'e' && !isInit) return;
  switch (e.key) {
    case "q":
      previousDir();
      break;
    case "w":
      nextDir();
      break;
    case "a":
      previousScene();
      break;
    case "s":
      nextScene();
      break;
    case "z":
      previousAnimation();
      break;
    case "x":
      nextAnimation();
      break;
    case "e":
      toggleDialog();
      break;
    case "d":
      exportImage();
      break;
    case "c":
      exportAnimation();
      break;
  }
  focusBody();
}

export function handleResize() {
  const { innerWidth: w, innerHeight: h } = window;
  live2dCanvas.width = w;
  live2dCanvas.height = h;
  live2dCanvas.style.width = `${w}px`;
  live2dCanvas.style.height = `${h}px`;
  spineCanvas.width = w;
  spineCanvas.height = h;
  spineCanvas.style.width = `${w}px`;
  spineCanvas.style.height = `${h}px`;
  windowWidthInput.value = w;
  windowHeightInput.value = h;
  aspectRatioToggle.value = h / w;
  if (!isInit) return;
  if (modelType === "live2d") {
    currentModel.position.set(w * 0.5 + moveX, h * 0.5 + moveY);
  }
}

function handleMouseOut() {
  handleMouseUp();
}

function handleMouseDown(e) {
  if (dialog.open) return;
  if (!isInit) return;
  if (isProcessing) return;
  if (e.button === 2) return;
  startX = e.clientX;
  startY = e.clientY;
  mouseDown = true;
  isMove =
    e.clientX < live2dCanvas.width - sidebarWidth && e.clientX > sidebarWidth;
}

function updateSidebarStyle(e) {
  if (e.clientX <= sidebarWidth) sidebar.style.visibility = "visible";
  else sidebar.style.visibility = "hidden";
}

function updateCursorStyle(e) {
  document.body.style.cursor = "default";
  if (e.clientX >= live2dCanvas.width - sidebarWidth)
    document.body.style.cursor = `url("../cursors/rotate_right.svg"), auto`;
}

function handleMouseMove(e) {
  updateSidebarStyle(e);
  updateCursorStyle(e);
  if (!mouseDown) return;
  if (isMove) {
    moveX += e.clientX - startX;
    moveY += e.clientY - startY;
    if (modelType === "live2d") {
      const { innerWidth: w, innerHeight: h } = window;
      currentModel.position.set(
        w * 0.5 + moveX,
        h * 0.5 + moveY
      );
    }
  } else if (e.clientX >= live2dCanvas.width - sidebarWidth) {
    rotate +=
      (e.clientY - startY) *
      rotateStep *
      (e.clientX >= live2dCanvas.width - sidebarWidth ? 1 : -1);
    if (modelType === "live2d") currentModel.rotation = rotate;
  }
  startX = e.clientX;
  startY = e.clientY;
}

function handleMouseUp() {
  mouseDown = false;
  isMove = false;
}

function handleWheel(e) {
  if (!isInit) return;
  if (e.clientX < sidebarWidth) return;
  const baseScaleStep = 0.1;
  const scaleFactor = 0.1;
  const scaleStep = baseScaleStep + Math.abs(scale - 1) * scaleFactor;
  scale = Math.min(
    scaleMax,
    Math.max(scaleMin, scale - Math.sign(e.deltaY) * scaleStep)
  );
  if (modelType === "live2d") {
    const { innerWidth: w, innerHeight: h } = window;
    let _scale = Math.min(
      w / currentModel.internalModel.originalWidth,
      h / currentModel.internalModel.originalHeight
    );
    _scale *= scale;
    currentModel.scale.set(_scale);
  }
}

function handlePMACheckboxChange() {
  premultipliedAlpha = pmaCheckbox.checked;
  focusBody();
}

function findMaxNumberInString(inputString) {
  const numbers = inputString.match(/d+/g);
  if (numbers === null) return null;
  const numArray = numbers.map(Number);
  const maxNumber = Math.max(...numArray);
  return maxNumber;
}

function setSceneIndex() {
  const sceneIds = dirFiles[dirSelector[dirSelector.selectedIndex].value];
  const maxNumber = findMaxNumberInString(sceneSelector.value);
  createSceneSelector(sceneIds);
  let index = sceneIds.findIndex((item) => item.includes(maxNumber));
  index = index === -1 ? 0 : index;
  sceneIndex = index;
  sceneSelector.selectedIndex = index;
}

function handleDirChange() {
  setSceneIndex();
  dispose();
  init();
}

function _handleSceneChange() {
  dispose();
  init();
}

function handleSceneChange(e) {
  sceneIndex = e.target.selectedIndex;
  _handleSceneChange();
}

export function handleLive2DAnimationChange(motion, index) {
  currentModel.motion(motion, Number(index), 3);
}

export function handleExpressionChange(e) {
  currentModel.expression("" === e.target.value ? currentModel.internalModel.motionManager.ExpressionManager?.defaultExpression : Number(e.target.value));
}

function handleSpineAnimationChange(index) {
  const animationName = skeletons["0"].skeleton.data.animations[index].name;
  for (const animationState of animationStates) {
    animationState.setAnimation(0, animationName, true);
  }
}

function handleAnimationChange(e) {
  if (modelType === "live2d") {
    const [motion, index] = e.target.value.split(",");
    handleLive2DAnimationChange(motion, index);
  } else {
    handleSpineAnimationChange(e.target.selectedIndex);
    createAttachmentUI();
  }
}

export function restoreAnimation(animationName) {
  const optionExists = Array.from(animationSelector.options).some(
    (option) => option.value === animationName
  );
  if (optionExists) {
    animationSelector.value = animationName;
    animationSelector.dispatchEvent(new Event("change"));
  }
}

export function resetAttachmentsCache() {
  attachmentsCache = {};
}

export function removeAttachments() {
  const attachmentNames = Object.keys(attachmentsCache);
  if (attachmentNames.length > 0) {
    const skeleton = skeletons["0"].skeleton;
    attachmentNames.forEach((name) => {
      const attachmentCheckboxes = document
        .getElementById("attachment")
        .querySelectorAll('input[type="checkbox"]');
      attachmentCheckboxes.forEach((checkbox) => {
        if (checkbox.parentElement.textContent === name) {
          checkbox.checked = false;
          const defaultSkin = skeleton.data.defaultSkin;
          const slotIndex = Number(checkbox.getAttribute("data-old-index"));
          const currentAttachment = defaultSkin.getAttachment(slotIndex, name);
          attachmentsCache[name] = [slotIndex, currentAttachment];
          defaultSkin.removeAttachment(slotIndex, name);
        }
      });
    });
    skeleton.setToSetupPose();
  }
}

function getCheckedSkinNames() {
  const checkboxes = skin.querySelectorAll("input[type='checkbox']:checked");
  return Array.from(checkboxes).map(
    (checkbox) => checkbox.parentElement.textContent
  );
}

export function saveSkins() {
  const skinFlags = [];
  const checkedSkinNames = getCheckedSkinNames();
  const allCheckboxes = skin.querySelectorAll("input[type='checkbox']");
  allCheckboxes.forEach((checkbox, index) => {
    skinFlags[index] = checkedSkinNames.includes(
      checkbox.parentElement.textContent
    );
  });
  return skinFlags;
}

export function restoreSkins(skinFlags) {
  const checkboxes = skin.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = skinFlags[index];
  });
  handleSkinCheckboxChange();
}

function handleSettingSelectorChange(e) {
  setting = e.target.value;
  resetSettingUI();
}

async function loadTranslations(lang) {
  const response = await fetch(`../locales/${lang}.json`);
  return await response.json();
}

function applyTranslations(translations) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[key]) {
      element.textContent = translations[key];
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    if (translations[key]) {
      element.placeholder = translations[key];
    }
  });
}

async function handleLanguageSelectorChange(e) {
  const lang = e.target.value;
  const translations = await loadTranslations(lang);
  applyTranslations(translations);
  localStorage.setItem("spive2d_language", lang);
  if (languageSelector) {
    languageSelector.value = lang;
  }
}

export function handleFilterInput() {
  const filterValue = filterBox.value.toLowerCase();
  settingDiv.querySelectorAll(".item").forEach((item) => {
    const label = item.querySelector("label");
    const title = label.getAttribute("title").toLowerCase() || "";
    item.style.display =
      title.includes(filterValue) || filterValue === "" ? "flex" : "none";
  });
}

function handleParameterSliderChange(e) {
  const inputs = Array.from(
    document.getElementById("parameter").querySelectorAll('input[type="range"]')
  );
  const index = inputs.indexOf(e.target);
  const parameterValues = currentModel.internalModel.coreModel._parameterValues;
  parameterValues[index] = e.target.value;
}

function handlePartCheckboxChange(e) {
  currentModel.internalModel.coreModel.setPartOpacityById(
    e.target.previousSibling.textContent,
    +e.target.checked
  );
}

function handleDrawableCheckboxChange(e) {
  opacities[Number(e.target.getAttribute("data-old-index"))] =
    +e.target.checked;
  currentModel.internalModel.coreModel._model.drawables.opacities = opacities;
}

function handleAttachmentCheckboxChange(e) {
  const skeleton = skeletons["0"].skeleton;
  const targetCheckbox = e.target.closest('input[type="checkbox"]');
  const name = targetCheckbox.closest("label").getAttribute("title");
  const slotIndex = Number(targetCheckbox.getAttribute("data-old-index"));
  const defaultSkin = skeleton.data.defaultSkin;
  if (targetCheckbox.checked) {
    if (attachmentsCache[name]) {
      const [cachedSlotIndex, cachedAttachment, wasFromSkin] = attachmentsCache[name];
      if (wasFromSkin) {
        defaultSkin.setAttachment(cachedSlotIndex, name, cachedAttachment);
        skeleton.setToSetupPose();
      } else {
        const slot = skeleton.slots[cachedSlotIndex];
        if (slot) {
          slot.attachment = cachedAttachment;
        }
      }
      delete attachmentsCache[name];
    }
  } else {
    const currentAttachment = defaultSkin.getAttachment(slotIndex, name);
    if (currentAttachment) {
      attachmentsCache[name] = [slotIndex, currentAttachment, true];
      defaultSkin.removeAttachment(slotIndex, name);
      skeleton.setToSetupPose();
    } else {
      const slot = skeleton.slots[slotIndex];
      if (slot && slot.attachment && slot.attachment.name === name) {
        attachmentsCache[name] = [slotIndex, slot.attachment, false];
        slot.attachment = null;
      }
    }
  }
}

function handleSkinCheckboxChange() {
  const skeleton = skeletons["0"].skeleton;
  const newSkin = new spine.Skin("_");
  const checkboxes = skin.querySelectorAll("input[type='checkbox']");
  skeleton.setSkin(null);
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      newSkin.addSkin(
        skeleton.data.findSkin(checkbox.parentElement.textContent)
      );
    }
  });
  skeleton.setSkin(newSkin);
  skeleton.setToSetupPose();
}

function handleSettingChange(e) {
  switch (setting) {
    case "parameters":
      handleParameterSliderChange(e);
      break;
    case "parts":
      handlePartCheckboxChange(e);
      break;
    case "drawables":
      handleDrawableCheckboxChange(e);
      break;
    case "attachments":
      handleAttachmentCheckboxChange(e);
      break;
    case "skins":
      handleSkinCheckboxChange();
      break;
  }
  focusBody();
}