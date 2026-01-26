import { animationStates, skeletons, spine } from "./spine-loader.js";
import { currentModel } from "./live2d-loader.js";
import { populateSceneSelector, dispose, init } from "../utils";
import {
  getFile,
  isProcessing,
  isInitialized,
  isModelType,
  setCurrentSetting,
  getCurrentSetting,
} from "../store";
import { getGlobalSetting, setGlobalSetting } from "../store/settings";
import { setSelectorState, getSelectorCurrentState } from "../store/selectors";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { getCurrentWindow, PhysicalSize } from "@tauri-apps/api/window";
import { createAttachments } from "../store/spine";

export let dirIndex = 0;
export let sceneIndex = 0;
export let isFirstRender = true;
export let premultipliedAlpha = false;
export let attachmentsCache = {};
let opacities;

const live2dCanvas = document.getElementById("live2dCanvas");
const spineCanvas = document.getElementById("spineCanvas");
const openDirectoryButton = document.getElementById("openDirectoryButton");

export function setOpacities(value) {
  opacities = value;
}

export function navigateAndTriggerChange(selector, delta) {
  const optionsLength = selector.options.length;
  if (optionsLength === 1) return;
  let newIndex =
    (selector.selectedIndex + delta + optionsLength) % optionsLength;
  selector.selectedIndex = newIndex;
  selector.dispatchEvent(new Event("change"));
}

function focusBody() {
  if (document.activeElement !== document.body) {
    document.activeElement.blur();
    document.body.focus();
  }
}

export function handlePMACheckboxChange(e) {
  premultipliedAlpha = e.target.checked;
  focusBody();
}

function findMaxNumberInString(inputString) {
  const numbers = inputString.match(/d+/g);
  if (numbers === null) return null;
  const numArray = numbers.map(Number);
  const maxNumber = Math.max(...numArray);
  return maxNumber;
}

function setSceneIndex(e) {
  if (!(e.target instanceof HTMLSelectElement)) return;

  const sceneIds = getFile(e.target.options[e.selectedIndex].value);
  const maxNumber = findMaxNumberInString(e.target.value);
  populateSceneSelector(sceneIds);
  let index = sceneIds.findIndex((item) => item.includes(maxNumber));
  index = index === -1 ? 0 : index;
  sceneIndex = index;
  setSelectorState("scene", { selectedIndex: index });
}

export function handleDirChange(e) {
  setSceneIndex(e);
  dispose();
  init();
}

function _handleSceneChange() {
  dispose();
  init();
}

export function handleSceneChange(e) {
  sceneIndex = e.target.selectedIndex;
  _handleSceneChange();
}

export function handleLive2DAnimationChange(motion, index) {
  currentModel.motion(motion, Number(index), 3);
}

export function handleExpressionChange(e) {
  currentModel.expression(
    "" === e.target.value
      ? currentModel.internalModel.motionManager.ExpressionManager
          ?.defaultExpression
      : Number(e.target.value),
  );
}

function handleSpineAnimationChange(index) {
  const animationName = skeletons["0"].skeleton.data.animations[index].name;
  for (const animationState of animationStates) {
    animationState.setAnimation(0, animationName, true);
  }
}

export function handleAnimationChange(e) {
  if (isModelType("live2d")) {
    const [motion, index] = e.target.value.split(",");
    handleLive2DAnimationChange(motion, index);
  } else {
    handleSpineAnimationChange(e.target.selectedIndex);
    createAttachments();
  }
}

// FIXME: escaped selector
export function restoreAnimation(animationName) {
  const optionExists = Array.from(
    getSelectorCurrentState("animate").options,
  ).some((option) => option.value === animationName);
  if (optionExists) {
    const animationSelector = document.getElementById("animationSelector");
    animationSelector.value = animationName;
    animationSelector.dispatchEvent(new Event("change"));
  }
}

export function resetAttachmentsCache() {
  attachmentsCache = {};
}

function getSkinAttachment(slotIndex, name, defaultSkin, skeleton) {
  let attachment = defaultSkin.getAttachment(slotIndex, name);
  let key = name;
  if (!attachment) {
    const slot = skeleton.slots[slotIndex];
    if (slot && slot.data.attachmentName) {
      const altKey = slot.data.attachmentName;
      const altAtt = defaultSkin.getAttachment(slotIndex, altKey);
      if (altAtt && altAtt.name === name) {
        attachment = altAtt;
        key = altKey;
      }
    }
  }
  return { attachment, key };
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
          const { attachment: currentAttachment, key: skinKey } =
            getSkinAttachment(slotIndex, name, defaultSkin, skeleton);
          if (currentAttachment) {
            attachmentsCache[name] = [
              slotIndex,
              currentAttachment,
              true,
              skinKey,
            ];
            defaultSkin.removeAttachment(slotIndex, skinKey);
          } else {
            const slot = skeleton.slots[slotIndex];
            if (slot && slot.attachment && slot.attachment.name === name) {
              attachmentsCache[name] = [
                slotIndex,
                slot.attachment,
                false,
                null,
              ];
              slot.attachment = null;
            }
          }
        }
      });
    });
    skeleton.setToSetupPose();
    syncHiddenAttachments();
  }
}

function syncHiddenAttachments() {
  const skeleton = skeletons["0"].skeleton;
  Object.values(attachmentsCache).forEach(([slotIndex, , wasFromSkin]) => {
    if (!wasFromSkin) {
      const slot = skeleton.slots[slotIndex];
      if (slot) slot.attachment = null;
    }
  });
}

function getCheckedSkinNames() {
  const skin = document.getElementById("skin");
  const checkboxes = skin.querySelectorAll("input[type='checkbox']:checked");
  return Array.from(checkboxes).map(
    (checkbox) => checkbox.parentElement.textContent,
  );
}

export function saveSkins() {
  const skin = document.getElementById("skin");
  const skinFlags = [];
  const checkedSkinNames = getCheckedSkinNames();
  const allCheckboxes = skin.querySelectorAll("input[type='checkbox']");
  allCheckboxes.forEach((checkbox, index) => {
    skinFlags[index] = checkedSkinNames.includes(
      checkbox.parentElement.textContent,
    );
  });
  return skinFlags;
}

export function restoreSkins(skinFlags) {
  const skin = document.getElementById("skin");
  const checkboxes = skin.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox, index) => {
    if (skinFlags[index] !== undefined) {
      checkbox.checked = skinFlags[index];
    }
  });
  handleSkinCheckboxChange();
}

export function handleFilterInput(value) {
  const filterValue = value?.toLowerCase() ?? "";
  const settingDiv = document.getElementById("setting");
  settingDiv.querySelectorAll(".item").forEach((item) => {
    const label = item.querySelector("label");
    const title = label.getAttribute("title").toLowerCase() || "";
    item.style.display =
      title.includes(filterValue) || filterValue === "" ? "flex" : "none";
  });
}

export function handleDrawableCheckboxChange(e) {
  opacities[Number(e.target.getAttribute("data-old-index"))] =
    +e.target.checked;
  currentModel.internalModel.coreModel._model.drawables.opacities = opacities;
}

export function handleAttachmentCheckboxChange(e) {
  const skeleton = skeletons["0"].skeleton;
  const targetCheckbox = e.target.closest('input[type="checkbox"]');
  const name = targetCheckbox.closest("label").getAttribute("title");
  const slotIndex = Number(targetCheckbox.getAttribute("data-old-index"));
  const defaultSkin = skeleton.data.defaultSkin;
  if (targetCheckbox.checked) {
    if (attachmentsCache[name]) {
      const [cachedSlotIndex, cachedAttachment, wasFromSkin, savedSkinKey] =
        attachmentsCache[name];
      if (wasFromSkin) {
        defaultSkin.setAttachment(
          cachedSlotIndex,
          savedSkinKey || name,
          cachedAttachment,
        );
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
    const { attachment: currentAttachment, key: skinKey } = getSkinAttachment(
      slotIndex,
      name,
      defaultSkin,
      skeleton
    );
    if (currentAttachment) {
      attachmentsCache[name] = [slotIndex, currentAttachment, true, skinKey];
      defaultSkin.removeAttachment(slotIndex, name);
      skeleton.setToSetupPose();
    } else {
      const slot = skeleton.slots[slotIndex];
      if (slot && slot.attachment && slot.attachment.name === name) {
        attachmentsCache[name] = [slotIndex, slot.attachment, false, null];
        slot.attachment = null;
      }
    }
  }
  syncHiddenAttachments();
}

function handleSkinCheckboxChange() {
  const skin = document.getElementById("skin");
  const skeleton = skeletons["0"].skeleton;
  const newSkin = new spine.Skin("_");
  const checkboxes = skin.querySelectorAll("input[type='checkbox']");
  skeleton.setSkin(null);
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      newSkin.addSkin(
        skeleton.data.findSkin(checkbox.parentElement.textContent),
      );
    }
  });
  skeleton.setSkin(newSkin);
  skeleton.setToSetupPose();
  syncHiddenAttachments();
}
