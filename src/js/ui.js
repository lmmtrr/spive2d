import { attachmentsCache, handleFilterInput, setOpacities } from "./events.js";
import { currentModel } from "./live2d-loader.js";
import { skeletons } from "./spine-loader.js";
import { getCurrentSetting, isModelType } from "../store";
import { sortByName, sortById } from "../sort";

const UIElements = {
  parameters: document.getElementById("parameters"),
  parts: document.getElementById("parts"),
  drawables: document.getElementById("drawables"),
  attachments: document.getElementById("attachments"),
  skins: document.getElementById("skins"),
  pmaDiv: document.getElementById("pmaDiv"),
  parameter: document.getElementById("parameter"),
  part: document.getElementById("part"),
  drawable: document.getElementById("drawable"),
  attachment: document.getElementById("attachment"),
  skin: document.getElementById("skin"),
  expressionSelector: document.getElementById("expressionSelector"),
  settingElement: document.getElementById("setting"),
  settingSelector: document.getElementById("settingSelector"),
};

function createCheckboxList(parentElement, items, isChecked = true) {
  const checkedAttribute = isChecked ? "checked" : "";
  const checkboxListHTML = items
    .map(
      ([name, index]) => `
      <div class="item">
        <label title="${name}">${name}<input type="checkbox" data-old-index="${index}" ${checkedAttribute}></label>
      </div>
    `,
    )
    .join("");
  parentElement.innerHTML = checkboxListHTML;
}

function createAttachmentCheckboxList(parentElement, items) {
  const checkboxListHTML = items
    .map(([name, index]) => {
      const isChecked = !attachmentsCache[name];
      const checkedAttribute = isChecked ? "checked" : "";
      return `
      <div class="item">
        <label title="${name}">${name}<input type="checkbox" data-old-index="${index}" ${checkedAttribute}></label>
      </div>
    `;
    })
    .join("");
  parentElement.innerHTML = checkboxListHTML;
}

function createParameterUI() {
  const coreModel = currentModel.internalModel.coreModel;
  if (!coreModel._parameterIds) return;
  const parametersData = coreModel._parameterIds
    .map((id, index) => ({
      id,
      index,
      max: coreModel._parameterMaximumValues[index],
      min: coreModel._parameterMinimumValues[index],
      value: coreModel._parameterValues[index],
    }))
    .sort(sortById);
  const parametersHTML = parametersData
    .map(
      ({ id, max, min, value }) => `
      <div class="item">
        <label title="${id}">${id}</label>
        <input type="range" max="${max}" min="${min}" step="${(max - min) / 100}" value="${value}">
      </div>
    `,
    )
    .join("");
  UIElements.parameter.innerHTML = parametersHTML;
}

function createCheckboxesFor(uiElement, sourceData, mapFn, filterFn) {
  if (!sourceData) return;
  let items = sourceData.map(mapFn);
  if (filterFn) items = items.filter(filterFn);
  const sortedItems = items.sort(sortByName);
  createCheckboxList(uiElement, sortedItems);
}

function createPartUI() {
  const partIds = currentModel.internalModel.coreModel?._partIds;
  createCheckboxesFor(UIElements.part, partIds, (value, index) => [
    value,
    index,
  ]);
}

function createDrawableUI() {
  const coreModel = currentModel.internalModel.coreModel;
  if (!coreModel?._drawableIds) return;
  const opacities = new Float32Array(coreModel._drawableIds.length);
  opacities.set(coreModel._model.drawables.opacities);
  setOpacities(opacities);
  createCheckboxesFor(
    UIElements.drawable,
    coreModel._drawableIds,
    (value, index) => [value, index],
    ([, index]) => Math.round(opacities[index]) > 0,
  );
}

export function createAttachmentUI() {
  const skeleton = skeletons["0"]?.skeleton;
  if (!skeleton) return;
  const attachmentSet = new Map();
  skeleton.slots.forEach((slot, index) => {
    if (slot.attachment) {
      attachmentSet.set(slot.attachment.name, index);
    }
  });
  for (const name in attachmentsCache) {
    if (!attachmentSet.has(name)) {
      const [index] = attachmentsCache[name];
      attachmentSet.set(name, index);
    }
  }
  const allAttachments = Array.from(attachmentSet.entries());
  createAttachmentCheckboxList(
    UIElements.attachment,
    allAttachments.sort(sortByName),
  );
}

function createSkinUI() {
  const skins = skeletons["0"].skeleton.data.skins;
  if (skins.length <= 1) {
    UIElements.settingSelector.disabled = true;
    return;
  }
  UIElements.settingSelector.disabled = false;
  const skinData = skins.slice(1).map((skin) => [skin.name, -1]);
  const skinsHTML = skinData
    .map(
      ([name]) => `
      <div class="item">
        <label title="${name}">${name}<input type="checkbox"></label>
      </div>
    `,
    )
    .join("");
  UIElements.skin.innerHTML = skinsHTML;
}

const optionsHTML = {
  parameters:
    '<option id="parameters" value="parameters" data-i18n="parameters">Parameters</option>',
  parts: '<option id="parts" value="parts" data-i18n="parts">Parts</option>',
  drawables:
    '<option id="drawables" value="drawables" data-i18n="drawables">Drawables</option>',
  attachments:
    '<option id="attachments" value="attachments" data-i18n="attachments">Attachments</option>',
  skins: '<option id="skins" value="skins" data-i18n="skins">Skins</option>',
};

function setElementDisplay(elements, display) {
  elements.forEach((elKey) => {
    if (UIElements[elKey]) {
      UIElements[elKey].style.display = display;
    }
  });
}

// TODO
function setupUIForLive2D() {
  setElementDisplay(["parameters", "parts", "drawables", "parameter"], "block");
  setElementDisplay(
    [
      "part",
      "drawable",
      "expressionSelector",
      "attachments",
      "skins",
      "attachment",
      "skin",
      "pmaDiv",
    ],
    "none",
  );
  UIElements.settingSelector.innerHTML = `
    ${optionsHTML.parameters}
    ${optionsHTML.parts}
    ${optionsHTML.drawables}
  `;
  UIElements.parameter.innerHTML = "";
  UIElements.part.innerHTML = "";
  UIElements.drawable.innerHTML = "";
  createParameterUI();
  createPartUI();
  createDrawableUI();
}

// TODO
function setupUIForSpine() {
  setElementDisplay(["attachments", "skins", "attachment", "pmaDiv"], "block");
  setElementDisplay(
    [
      "skin",
      "parameters",
      "parts",
      "drawables",
      "parameter",
      "part",
      "drawable",
      "expressionSelector",
    ],
    "none",
  );
  UIElements.settingSelector.innerHTML = `
    ${optionsHTML.attachments}
    ${optionsHTML.skins}
  `;
  UIElements.attachment.innerHTML = "";
  UIElements.skin.innerHTML = "";
  createAttachmentUI();
  createSkinUI();
}

export function resetUI() {
  if (isModelType("live2d")) {
    setupUIForLive2D();
  } else if (isModelType("spine")) {
    setupUIForSpine();
  }
  if (UIElements.settingElement) {
    UIElements.settingElement.scrollTop = 0;
  }
  handleFilterInput();
}

export function resetSettingUI() {
  const allPanels = [
    UIElements.parameter,
    UIElements.part,
    UIElements.drawable,
    UIElements.attachment,
    UIElements.skin,
  ];
  allPanels.forEach((p) => {
    if (p) p.style.display = "none";
  });
  const panelMap = {
    parameters: UIElements.parameter,
    parts: UIElements.part,
    drawables: UIElements.drawable,
    attachments: UIElements.attachment,
    skins: UIElements.skin,
  };
  const selectedPanel = panelMap[getCurrentSetting()];
  if (selectedPanel) {
    selectedPanel.style.display = "block";
  }
}
