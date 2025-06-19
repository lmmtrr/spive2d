import {
  dirSelector,
  sceneSelector,
  setRecordingFlag,
} from "./events.js";
import { animationStates } from "./spine-loader.js";
const { convertFileSrc } = window.__TAURI__.core;

// ref. https://github.com/Nikke-db/nikke-db-vue/blob/main/src/components/common/Spine/Loader.vue
const RECORDING_MIME_TYPE = "video/webm;codecs=vp8";
const RECORDING_BITRATE = 12000000;
const RECORDING_FRAME_RATE = 60;
const RECORDING_TIME_SLICE = 10;
const ANIMATION_TIME_EPSILON = 0.02;

let live2dAnimationDuration;
let recordingStartTime;

export async function startRecording(modelType, animationName) {
  const chunks = [];
  let canvas;
  let rec;
  if (modelType === "spine") {
    canvas = document.getElementById("spineCanvas");
  } else if (modelType === "live2d") {
    canvas = document.getElementById("live2dCanvas");
    if (animationName.endsWith(".json")) {
      const file = await fetch(convertFileSrc(`${dirSelector[dirSelector.selectedIndex].value}motions/${animationName}`));
      const content = await file.text();
      const jsonData = JSON.parse(content);
      live2dAnimationDuration = jsonData.Meta.Duration;
      recordingStartTime = performance.now();
    } else {
      setRecordingFlag(false);
      return;
    }
  }

  const stream = canvas.captureStream(RECORDING_FRAME_RATE);
  rec = new MediaRecorder(stream, {
    mimeType: RECORDING_MIME_TYPE,
    videoBitsPerSecond: RECORDING_BITRATE,
  });

  rec.start(RECORDING_TIME_SLICE);

  rec.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  rec.onstart = () => {
    requestAnimationFrame(() => checkCondition(modelType, rec));
  };

  rec.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const selectedSceneText =
      sceneSelector.options[sceneSelector.selectedIndex].textContent;
    link.download = `${selectedSceneText}_${animationName.split(".")[0]}.webm`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setRecordingFlag(false);
  };
}

function checkCondition(modelType, rec) {
  if (modelType === "spine") {
    if (
      animationStates[0] &&
      animationStates[0].tracks &&
      animationStates[0].tracks[0] &&
      animationStates[0].tracks[0].animationLast !== -1 &&
      animationStates[0].tracks[0].animationLast + ANIMATION_TIME_EPSILON >=
      animationStates[0].tracks[0].animationEnd
    ) {
      rec.stop();
    } else {
      requestAnimationFrame(() => checkCondition(modelType, rec));
    }
  } else if (modelType === "live2d") {
    const elapsedTime = (performance.now() - recordingStartTime) / 1000;
    if (elapsedTime >= live2dAnimationDuration - ANIMATION_TIME_EPSILON) {
      rec.stop();
    } else {
      requestAnimationFrame(() => checkCondition(modelType, rec));
    }
  }
}