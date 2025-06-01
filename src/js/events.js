import { startRecording } from "./export.js";
import { animationStates, skeletons, spine } from "./spine-loader.js";
import {
  dispose,
  dirFiles,
  init,
  isInit,
  modelType,
} from "./main.js";
import { currentModel } from "./live2d-loader.js";
import { createSceneSelector, resetSettingUI } from "./ui.js";

let scaleAdjustment = 1;
const scaleInit = 1;
const scaleMax = 8;
const scaleMin = 1;
const scaleStep = 0.2;
const rotateStep = 0.001;
export const moveStep = 0.001;
export let scale = scaleInit;
export let moveX = 0;
export let moveY = 0;
export let rotate = 0;
export let dirIndex = 0;
export let sceneIndex = 0;
let startX = 0;
let startY = 0;
let mouseDown = false;
let isMove = false;
let isRecording = false;
export let isFirstRender = true;
export let premultipliedAlpha = false;
export let setting = "parameters";
let attachmentsCache = {};
let opacities;

const rootStyles = getComputedStyle(document.documentElement);
const sidebarWidth = Number(
  rootStyles.getPropertyValue("--sidebar-width").replace("px", "")
);

const sidebar = document.getElementById("sidebar");
const pmaCheckbox = document.getElementById("pmaCheckbox");
export const dirSelector = document.getElementById("dirSelector");
export const sceneSelector = document.getElementById("sceneSelector");
export const animationSelector = document.getElementById("animationSelector");
const settingSelector = document.getElementById("settingSelector");
const filterBox = document.getElementById("filterBox");
const settingDiv = document.getElementById("setting");
const skin = document.getElementById("skin");
const live2dCanvas = document.getElementById("live2dCanvas");
const spineCanvas = document.getElementById("spineCanvas");
setupEventListeners();

export function setScaleAdjustment(value) {
  scaleAdjustment = value;
}

export function setOpacities(value) {
  opacities = value;
}

export function setRecordingFlag(flag) {
  isRecording = flag;
}

export function setFirstRenderFlag(flag) {
  isFirstRender = flag;
}

export function resetValues() {
  scale = scaleInit;
  moveX = 0;
  moveY = 0;
  rotate = 0;
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
  settingSelector.addEventListener("change", handleSettingSelectorChange);
  filterBox.addEventListener("input", handleFilterInput);
  settingDiv.addEventListener("input", handleSettingChange);
}

function previousDir() {
  const optionsLength = dirSelector.options.length;
  if (optionsLength === 1) return;
  dirIndex = (dirSelector.selectedIndex - 1 + optionsLength) % optionsLength;
  dirSelector.selectedIndex = dirIndex;
  handleDirChange();
}

function nextDir() {
  const optionsLength = dirSelector.options.length;
  if (optionsLength === 1) return;
  dirIndex = (dirSelector.selectedIndex + 1) % optionsLength;
  dirSelector.selectedIndex = dirIndex;
  handleDirChange();
}

function previousScene() {
  const optionsLength = sceneSelector.options.length;
  if (optionsLength === 1) return;
  sceneIndex =
    (sceneSelector.selectedIndex - 1 + optionsLength) % optionsLength;
  sceneSelector.selectedIndex = sceneIndex;
  _handleSceneChange();
}

function nextScene() {
  const optionsLength = sceneSelector.options.length;
  if (optionsLength === 1) return;
  sceneIndex = (sceneSelector.selectedIndex + 1) % optionsLength;
  sceneSelector.selectedIndex = sceneIndex;
  _handleSceneChange();
}

function previousAnimation() {
  const optionsLength = animationSelector.options.length;
  if (optionsLength === 1) return;
  let animationIndex =
    (animationSelector.selectedIndex - 1 + optionsLength) % optionsLength;
  animationSelector.selectedIndex = animationIndex;
  if (modelType === "live2d") {
    const [motion, index] = animationSelector.value.split(",");
    handleLive2DAnimationChange(motion, index);
  } else {
    handleSpineAnimationChange(animationIndex);
  }
}

function nextAnimation() {
  const optionsLength = animationSelector.options.length;
  if (optionsLength === 1) return;
  let animationIndex =
    (animationSelector.selectedIndex + 1) % optionsLength;
  animationSelector.selectedIndex = animationIndex;
  if (modelType === "live2d") {
    const [motion, index] = animationSelector.value.split(",");
    handleLive2DAnimationChange(motion, index);
  } else handleSpineAnimationChange(animationIndex);
}

function exportImage() {
  const activeCanvas = modelType === "live2d" ? live2dCanvas : spineCanvas;
  const screenshotCanvas = document.getElementById("screenshotCanvas");
  const ctx = screenshotCanvas.getContext("2d", { willReadFrequently: true });
  const { width, height } = activeCanvas;
  screenshotCanvas.width = width;
  screenshotCanvas.height = height;
  let previousImageData = null;
  copyCanvasContent();

  function copyCanvasContent() {
    ctx.drawImage(activeCanvas, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    if (previousImageData === null) {
      previousImageData = imageData;
    } else {
      const link = document.createElement("a");
      const selectedSceneText =
        sceneSelector.options[sceneSelector.selectedIndex].textContent;
      link.download = `${selectedSceneText}.png`;
      link.href = screenshotCanvas.toDataURL();
      link.click();
      return;
    }
    requestAnimationFrame(copyCanvasContent);
  }
}

function exportAnimation() {
  if (isRecording) return;
  if (modelType === "spine") {
    isRecording = true;
    for (const animatinState of animationStates) {
      animatinState.setAnimation(0, animationSelector.value, true);
    }
    startRecording();
  }
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
  if (!isInit) return;
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
    case "d":
      exportImage();
      break;
    case "c":
      exportAnimation();
      break;
  }
  focusBody();
}

function handleResize() {
  const { innerWidth: w, innerHeight: h } = window;
  live2dCanvas.width = w;
  live2dCanvas.height = h;
  live2dCanvas.style.width = `${w}px`;
  live2dCanvas.style.height = `${h}px`;
  spineCanvas.width = w;
  spineCanvas.height = h;
  spineCanvas.style.width = `${w}px`;
  spineCanvas.style.height = `${h}px`;
}

function handleMouseOut() {
  handleMouseUp();
}

function handleMouseDown(e) {
  if (!isInit) return;
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
    if (modelType === "live2d")
      currentModel.position.set(
        window.innerWidth * 0.5 + moveX,
        window.innerHeight * 0.5 + moveY
      );
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
  scale = Math.min(
    scaleMax,
    Math.max(scaleMin, scale - Math.sign(e.deltaY) * scaleStep)
  );
  if (modelType === "live2d") currentModel.scale.set(scale * scaleAdjustment);
}

function handlePMACheckboxChange() {
  premultipliedAlpha = pmaCheckbox.checked;
  focusBody();
}

function findMaxNumberInString(inputString) {
  const numbers = inputString.match(/\d+/g);
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

function handleLive2DAnimationChange(motion, index) {
  const motionManager = currentModel.internalModel.motionManager;
  motionManager.stopAllMotions();
  motionManager.startMotion(motion, Number(index), 1);
}

function handleSpineAnimationChange(index) {
  const animationName = skeletons["0"].skeleton.data.animations[index].name;
  for (const animationState of animationStates) {
    animationState.setAnimation(0, animationName, true);
  }
  isFirstRender = true;
}

function handleAnimationChange(e) {
  if (modelType === "live2d") {
    const [motion, index] = e.target.value.split(",");
    handleLive2DAnimationChange(motion, index);
  } else {
    handleSpineAnimationChange(e.target.selectedIndex);
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

export function handleFilterInput() {
  const filterValue = filterBox.value.toLowerCase();
  settingDiv.querySelectorAll(".item").forEach((item) => {
    const label = item.querySelector("label");
    const title = label.getAttribute("title").toLowerCase() || "";
    item.style.display =
      title.includes(filterValue) || filterValue === "" ? "" : "none";
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
    if (attachmentsCache[name] && attachmentsCache[name][1]) {
      defaultSkin.setAttachment(
        attachmentsCache[name][0],
        name,
        attachmentsCache[name][1]
      );
      delete attachmentsCache[name];
    }
  } else {
    const currentAttachment = defaultSkin.getAttachment(slotIndex, name);
    if (currentAttachment) {
      attachmentsCache[name] = [slotIndex, currentAttachment];
      defaultSkin.removeAttachment(slotIndex, name);
    }
  }
  skeleton.setToSetupPose();
}

export function handleSkinCheckboxChange() {
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
