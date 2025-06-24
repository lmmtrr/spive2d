import { modelType, setProcessing } from "./main.js";
import {
  animationSelector,
  changeToOriginalSize,
  dirSelector,
  handleLive2DAnimationChange,
  restorePreviousSize,
  sceneSelector,
} from "./events.js";
import { currentModel } from "./live2d-loader.js";
import { animationStates, skeletons } from "./spine-loader.js";
const { convertFileSrc } = window.__TAURI__.core;

// ref. https://github.com/Nikke-db/nikke-db-vue/blob/main/src/components/common/Spine/Loader.vue
const RECORDING_MIME_TYPE = "video/webm;codecs=vp8";
const RECORDING_BITRATE = 12000000;
const RECORDING_FRAME_RATE = 60;
let isRecording = false;
let live2dAnimationDuration;
let recordingStartTime;
let activeCanvas;
let prevActiveCanvasState;

const progressBarContainer = document.getElementById("progressBarContainer");
const progressBar = document.getElementById("progressBar");

export function exportAnimation() {
  if (isRecording) return;
  let animationName;
  if (modelType === "spine") {
    animationName = animationSelector.value;
  } else if (modelType === "live2d") {
    animationName = animationSelector.options[animationSelector.selectedIndex].textContent;
  }
  startRecording(modelType, animationName);
}

async function startRecording(modelType, animationName) {
  isRecording = true;
  setProcessing(true);
  progressBar.style.width = "0%";
  progressBarContainer.style.display = "block";
  const chunks = [];
  const originalSizeCheckbox = document.getElementById("originalSizeCheckbox");
  const live2dCanvas = document.getElementById("live2dCanvas");
  const spineCanvas = document.getElementById("spineCanvas");
  activeCanvas = modelType === 'live2d' ? live2dCanvas : spineCanvas;
  const screenshotCanvas = document.getElementById("screenshotCanvas");
  if (originalSizeCheckbox.checked) {
    ({ prevActiveCanvasState } = changeToOriginalSize(activeCanvas, screenshotCanvas, modelType, currentModel, skeletons));
  }
  if (modelType === "spine") {
    for (const animationState of animationStates) {
      animationState.tracks[0].trackTime = 0;
    }
  } else if (modelType === "live2d") {
    if (animationName.endsWith(".json")) {
      const file = await fetch(convertFileSrc(`${dirSelector[dirSelector.selectedIndex].value}motions/${animationName}`));
      const content = await file.text();
      const jsonData = JSON.parse(content);
      live2dAnimationDuration = jsonData.Meta.Duration;
      recordingStartTime = performance.now();
      const [motion, index] = animationSelector.value.split(",");
      handleLive2DAnimationChange(motion, index);
      await new Promise(resolve => setTimeout(resolve, 300));
    } else {
      isRecording = false;
      setProcessing(false);
      if (originalSizeCheckbox.checked) restorePreviousSize(activeCanvas, prevActiveCanvasState, modelType, currentModel);
      progressBarContainer.style.display = "none";
      return;
    }
  }

  const stream = activeCanvas.captureStream(RECORDING_FRAME_RATE);
  const rec = new MediaRecorder(stream, {
    mimeType: RECORDING_MIME_TYPE,
    videoBitsPerSecond: RECORDING_BITRATE,
  });

  rec.start();

  rec.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  rec.onstart = () => {
    requestAnimationFrame(() => checkCondition(modelType, rec));
  };

  rec.onstop = async () => {
    progressBarContainer.style.display = "none";
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const selectedSceneText =
      sceneSelector.options[sceneSelector.selectedIndex].textContent;
    link.download = `${selectedSceneText}_${animationName.split(".")[0]}.webm`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    isRecording = false;
    setProcessing(false);
    if (originalSizeCheckbox.checked) restorePreviousSize(activeCanvas, prevActiveCanvasState, modelType, currentModel);
  };
}

function checkCondition(modelType, rec) {
  let progress = 0;
  if (modelType === "spine") {
    const track = animationStates[0].tracks[0];
    if (track.trackTime >= track.animationEnd) {
      rec.stop();
    } else {
      progress = (track.trackTime / track.animationEnd) * 100;
      requestAnimationFrame(() => checkCondition(modelType, rec));
    }
  } else if (modelType === "live2d") {
    const elapsedTime = (performance.now() - recordingStartTime) / 1000;
    if (elapsedTime >= live2dAnimationDuration) {
      rec.stop();
    } else {
      progress = (elapsedTime / live2dAnimationDuration) * 100;
      requestAnimationFrame(() => checkCondition(modelType, rec));
    }
  }
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}