import { handleFilterInput, setOpacities, setting } from "./events.js";
import { currentModel } from "./live2d-loader.js";
import { modelType } from "./main.js";
import { skeletons } from "./spine-loader.js";

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
  dirSelector: document.getElementById("dirSelector"),
  sceneSelector: document.getElementById("sceneSelector"),
  animationSelector: document.getElementById("animationSelector"),
  settingElement: document.getElementById("setting"),
  settingSelector: document.getElementById("settingSelector"),
};

export function getSortableKey(str, padLength = 16) {
  const s = String(str || "");
  return s.replace(/\d+/g, (match) => match.padStart(padLength, '0'));
}

const createSorter = (keyExtractor) => (a, b) => {
  const keyA = getSortableKey(keyExtractor(a));
  const keyB = getSortableKey(keyExtractor(b));
  if (keyA < keyB) return -1;
  if (keyA > keyB) return 1;
  return 0;
};

const sortByText = createSorter(item => item.text);
const sortById = createSorter(item => item.id);
const sortByName = createSorter(item => item[0]);

function populateSelector(element, items, valueMapper, textMapper, initialOptions = "") {
  const options = items
    .map(item => `<option value="${valueMapper(item)}">${textMapper(item)}</option>`)
    .join("");
  element.innerHTML = initialOptions + options;
}

export function createDirSelector(dirs) {
  populateSelector(UIElements.dirSelector, dirs, dir => dir, dir => dir.split("/").filter(Boolean).pop());
}

export function createSceneSelector(sceneIds) {
  populateSelector(UIElements.sceneSelector, sceneIds, scenePath => scenePath[0], scenePath => scenePath[0].split("/").filter(Boolean).pop());
}

export function createAnimationSelector(animations) {
  if (modelType === "live2d") {
    const displayableAnimations = Object.entries(animations)
      .flatMap(([groupName, anims]) =>
        anims.map((anim, originalIndex) => ({
          text: (anim.file || anim.File || "").split("/").pop(),
          value: `${groupName},${originalIndex}`,
        }))
      )
      .sort(sortByText);
    populateSelector(UIElements.animationSelector, displayableAnimations, anim => anim.value, anim => anim.text);
  } else if (modelType === "spine") {
    populateSelector(UIElements.animationSelector, animations, v => v.name, v => v.name);
  }
}

export function createExpressionSelector(expressions) {
  if (modelType === "live2d") {
    const displayableExpressions = expressions
      .map((expr, originalIndex) => ({
        text: (expr.file || expr.File || "").split("/").pop(),
        value: String(originalIndex),
      }))
      .sort(sortByText);
    populateSelector(UIElements.expressionSelector, displayableExpressions, expr => expr.value, expr => expr.text, `<option value="">Default</option>`);
  }
}

function createCheckboxList(parentElement, items, isChecked = true) {
  const checkedAttribute = isChecked ? 'checked' : '';
  const checkboxListHTML = items
    .map(([name, index]) => `
      <div class="item">
        <label title="${name}">${name}<input type="checkbox" data-old-index="${index}" ${checkedAttribute}></label>
      </div>
    `)
    .join('');
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
    .map(({ id, max, min, value }) => `
      <div class="item">
        <label title="${id}">${id}</label>
        <input type="range" max="${max}" min="${min}" step="${(max - min) / 100}" value="${value}">
      </div>
    `)
    .join('');
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
  createCheckboxesFor(
    UIElements.part,
    partIds,
    (value, index) => [value, index]
  );
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
    ([, index]) => Math.round(opacities[index]) > 0
  );
}

function createAttachmentUI() {
  const slots = skeletons["0"]?.skeleton?.slots;
  createCheckboxesFor(
    UIElements.attachment,
    slots,
    (slot, index) => [slot.attachment?.name, index],
    ([name]) => !!name
  );
}

function createSkinUI() {
  const skins = skeletons["0"].skeleton.data.skins;
  if (skins.length <= 1) {
    UIElements.settingSelector.disabled = true;
    return;
  }
  UIElements.settingSelector.disabled = false;
  const skinData = skins.slice(1).map(skin => [skin.name, -1]);
  const skinsHTML = skinData
    .map(([name]) => `
      <div class="item">
        <label title="${name}">${name}<input type="checkbox"></label>
      </div>
    `)
    .join('');
  UIElements.skin.innerHTML = skinsHTML;
}

function setElementDisplay(elements, display) {
  elements.forEach(elKey => {
    UIElements[elKey].style.display = display;
  });
}

function setupUIForLive2D() {
  setElementDisplay(['parameters', 'parts', 'drawables', 'parameter'], 'block');
  setElementDisplay(['part', 'drawable', 'expressionSelector', 'attachments', 'skins', 'attachment', 'skin', 'pmaDiv'], 'none');
  UIElements.parameter.innerHTML = "";
  UIElements.part.innerHTML = "";
  UIElements.drawable.innerHTML = "";
  createParameterUI();
  createPartUI();
  createDrawableUI();
}

function setupUIForSpine() {
  setElementDisplay(['attachments', 'skins', 'attachment', 'pmaDiv'], 'block');
  setElementDisplay(['skin', 'parameters', 'parts', 'drawables', 'parameter', 'part', 'drawable', 'expressionSelector'], 'none');
  UIElements.attachment.innerHTML = "";
  UIElements.skin.innerHTML = "";
  createAttachmentUI();
  createSkinUI();
}

export function resetUI() {
  if (modelType === "live2d") {
    setupUIForLive2D();
  } else if (modelType === "spine") {
    setupUIForSpine();
  }
  UIElements.settingElement.scrollTop = 0;
  handleFilterInput();
}

export function resetSettingUI() {
  const allPanels = [UIElements.parameter, UIElements.part, UIElements.drawable, UIElements.attachment, UIElements.skin];
  allPanels.forEach(p => p.innerHTML = "");
  const panelCreationMap = {
    parameters: createParameterUI,
    parts: createPartUI,
    drawables: createDrawableUI,
    attachments: createAttachmentUI,
    skins: createSkinUI,
  };
  if (panelCreationMap[setting]) panelCreationMap[setting]();
}