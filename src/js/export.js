import {
  animationSelector,
  sceneSelector,
  setRecordingFlag,
} from "./events.js";
import { splitExt } from "./main.js";
import { animationState } from "./spine-loader.js";

// ref. https://github.com/Nikke-db/nikke-db-vue/blob/main/src/components/common/Spine/Loader.vue
const RECORDING_MIME_TYPE = "video/webm;codecs=vp8";
const RECORDING_BITRATE = 12000000;
const RECORDING_FRAME_RATE = 60;
const RECORDING_TIME_SLICE = 10;
const ANIMATION_TIME_EPSILON = 0.02;

export function startRecording() {
  const chunks = [];
  const spineCanvas = document.getElementById("spineCanvas");
  const stream = spineCanvas.captureStream(RECORDING_FRAME_RATE);
  const rec = new MediaRecorder(stream, {
    mimeType: RECORDING_MIME_TYPE,
    videoBitsPerSecond: RECORDING_BITRATE,
  });
  rec.start(RECORDING_TIME_SLICE);

  rec.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  rec.onstart = () => {
    requestAnimationFrame(checkCondition);
  };

  rec.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const selectedSceneText =
      sceneSelector.options[sceneSelector.selectedIndex].textContent;
    link.download = `${splitExt(selectedSceneText)[0]}_${
      animationSelector.value
    }.webm`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    setRecordingFlag(false);
  };

  function checkCondition() {
    if (
      animationState.tracks &&
      animationState.tracks[0] &&
      animationState.tracks[0].animationLast !== -1 &&
      animationState.tracks[0].animationLast + ANIMATION_TIME_EPSILON >
        animationState.tracks[0].animationEnd
    ) {
      rec.stop();
    } else {
      requestAnimationFrame(checkCondition);
    }
  }
}
