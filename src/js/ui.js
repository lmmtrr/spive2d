import { handleFilterInput, setOpacities, setting } from "./events.js";
import { currentModel } from "./live2d-loader.js";
import { modelType } from "./main.js";
import { skeletons } from "./spine-loader.js";

const parameters = document.getElementById("parameters");
const parts = document.getElementById("parts");
const drawables = document.getElementById("drawables");
const attachments = document.getElementById("attachments");
const skins = document.getElementById("skins");
const parameter = document.getElementById("parameter");
const part = document.getElementById("part");
const drawable = document.getElementById("drawable");
const attachment = document.getElementById("attachment");
const skin = document.getElementById("skin");
parameters.style.display = "none";
parts.style.display = "none";
drawables.style.display = "none";
attachments.style.display = "none";
skins.style.display = "none";
checkbox.style.display = "none";
parameter.style.display = "none";
part.style.display = "none";
drawable.style.display = "none";
attachment.style.display = "none";
skin.style.display = "none";

export function getSortableKey(str, padLength = 16) {
  const s = String(str || "");
  return s.replace(/\d+/g, (match) => match.padStart(padLength, '0'));
}

export function createDirSelector(dirs) {
  const options = dirs
    .map((dir) => {
      const textContent = dir.split("/").filter(Boolean).pop();
      return `<option value="${dir}">${textContent}</option>`;
    })
    .join("");
  document.getElementById("dirSelector").innerHTML = options;
}

export function createSceneSelector(sceneIds) {
  const options = sceneIds
    .map((scenePath) => {
      const textContent = scenePath[0].split("/").filter(Boolean).pop();
      return `<option value="${scenePath[0]}">${textContent}</option>`;
    })
    .join("");
  document.getElementById("sceneSelector").innerHTML = options;
}

export function createAnimationSelector(animations) {
  let options = "";
  if (modelType === "live2d") {
    options = Object.entries(animations)
      .flatMap(([key, values]) =>
        values.map((value, index) => {
          const file = (value.file ?? value.File).split("/").pop();
          return `<option value="${key},${index}">${file}</option>`;
        })
      )
      .join("");
  } else {
    options = animations.map((v) => `<option>${v.name}</option>`).join("");
  }
  document.getElementById("animationSelector").innerHTML = options;
}

function createParameterUI() {
  const parameterIds = currentModel.internalModel.coreModel._parameterIds;
  if (!parameterIds) return;
  const a = parameterIds.map((value, index) => [value, index]);
  a.sort((aItem, bItem) => {
    const keyA = getSortableKey(aItem[0]);
    const keyB = getSortableKey(bItem[0]);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  const parameterMaximumValues =
    currentModel.internalModel.coreModel._parameterMaximumValues;
  const parameterMinimumValues =
    currentModel.internalModel.coreModel._parameterMinimumValues;
  const parameterValues = currentModel.internalModel.coreModel._parameterValues;
  const parameter = document.getElementById("parameter");
  parameter.style.display = "block";
  a.forEach((item) => {
    const value = item[0];
    const index = item[1];
    const div = document.createElement("div");
    div.className = "item";
    const label = document.createElement("label");
    label.title = value;
    label.textContent = value;
    const input = document.createElement("input");
    input.type = "range";
    input.max = parameterMaximumValues[index];
    input.min = parameterMinimumValues[index];
    input.step =
      (parameterMaximumValues[index] + parameterMinimumValues[index]) / 10;
    input.value = parameterValues[index];
    div.appendChild(label);
    div.appendChild(input);
    parameter.appendChild(div);
  });
}

function createPartUI() {
  const partIds = currentModel.internalModel.coreModel._partIds;
  if (!partIds) return;
  const a = partIds.map((value, index) => [value, index]);
  a.sort((aItem, bItem) => {
    const keyA = getSortableKey(aItem[0]);
    const keyB = getSortableKey(bItem[0]);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  const part = document.getElementById("part");
  part.style.display = "none";
  for (let i = 0; i < a.length; i++) {
    const div = document.createElement("div");
    div.className = "item";
    const label = document.createElement("label");
    label.title = a[i][0];
    label.textContent = a[i][0];
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = "checked";
    input.dataset.oldIndex = String(a[i][1]);
    label.appendChild(input);
    div.appendChild(label);
    part.appendChild(div);
  }
}

function createDrawableUI() {
  const drawableIds = currentModel.internalModel.coreModel._drawableIds;
  if (!drawableIds) return;
  const opacities = new Float32Array(drawableIds.length);
  opacities.set(
    currentModel.internalModel.coreModel._model.drawables.opacities
  );
  setOpacities(opacities);
  const a = drawableIds.map((value, index) => [value, index]);
  a.sort((aItem, bItem) => {
    const keyA = getSortableKey(aItem[0]);
    const keyB = getSortableKey(bItem[0]);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  const drawable = document.getElementById("drawable");
  drawable.style.display = "none";
  for (let i = 0; i < a.length; i++) {
    if (Math.round(opacities[a[i][1]])) {
      const div = document.createElement("div");
      div.className = "item";
      const label = document.createElement("label");
      label.title = a[i][0];
      label.textContent = a[i][0];
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = "checked";
      input.dataset.oldIndex = String(a[i][1]);
      label.appendChild(input);
      div.appendChild(label);
      drawable.appendChild(div);
    }
  }
}

function createAttachmentUI() {
  const slots = skeletons["0"].skeleton.slots;
  const a = slots.map((value, index) => [value.attachment?.name, index]);
  a.sort((aItem, bItem) => {
    const keyA = getSortableKey(aItem[0]);
    const keyB = getSortableKey(bItem[0]);
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  const f = a.filter((v) => v[0]);
  const attachment = document.getElementById("attachment");
  attachment.style.display = "block";
  for (let i = 0; i < f.length; i++) {
    const div = document.createElement("div");
    div.className = "item";
    const label = document.createElement("label");
    label.title = f[i][0];
    label.textContent = f[i][0];
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = "checked";
    input.dataset.oldIndex = String(f[i][1]);
    label.appendChild(input);
    div.appendChild(label);
    attachment.appendChild(div);
  }
}

function createSkinUI() {
  const skins = skeletons["0"].skeleton.data.skins;
  if (skins.length === 1)
    document.getElementById("settingSelector").disabled = true;
  else {
    const skin = document.getElementById("skin");
    skin.style.display = "none";
    for (let i = 1; i < skins.length; i++) {
      const div = document.createElement("div");
      div.className = "item";
      const label = document.createElement("label");
      label.title = skins[i].name;
      label.textContent = skins[i].name;
      const input = document.createElement("input");
      input.type = "checkbox";
      if (i === 0) input.checked = "checked";
      label.appendChild(input);
      div.appendChild(label);
      skin.appendChild(div);
    }
  }
}

export function resetUI() {
  if (modelType === "live2d") {
    parameters.style.display = "block";
    parts.style.display = "block";
    drawables.style.display = "block";
    attachments.style.display = "none";
    skins.style.display = "none";
    checkbox.style.display = "none";
    parameter.style.display = "block";
    part.style.display = "block";
    drawable.style.display = "block";
    attachment.style.display = "none";
    skin.style.display = "none";
    parameter.innerHTML = "";
    part.innerHTML = "";
    drawable.innerHTML = "";
    createParameterUI();
    createPartUI();
    createDrawableUI();
  } else {
    parameters.style.display = "none";
    parts.style.display = "none";
    drawables.style.display = "none";
    attachments.style.display = "block";
    skins.style.display = "block";
    checkbox.style.display = "block";
    parameter.style.display = "none";
    part.style.display = "none";
    drawable.style.display = "none";
    attachment.style.display = "block";
    skin.style.display = "block";
    attachment.innerHTML = "";
    skin.innerHTML = "";
    createAttachmentUI();
    createSkinUI();
  }
  document.getElementById("setting").scrollTop = 0;
  handleFilterInput();
}

export function resetSettingUI() {
  const parameter = document.getElementById("parameter");
  const part = document.getElementById("part");
  const drawable = document.getElementById("drawable");
  const attachment = document.getElementById("attachment");
  const skin = document.getElementById("skin");
  switch (setting) {
    case "parameters":
      parameter.style.display = "block";
      part.style.display = "none";
      drawable.style.display = "none";
      break;
    case "parts":
      parameter.style.display = "none";
      part.style.display = "block";
      drawable.style.display = "none";
      break;
    case "drawables":
      parameter.style.display = "none";
      part.style.display = "none";
      drawable.style.display = "block";
      break;
    case "attachments":
      attachment.style.display = "block";
      skin.style.display = "none";
      break;
    case "skins":
      attachment.style.display = "none";
      skin.style.display = "block";
      break;
  }
}
