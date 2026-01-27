import { handleLive2DAnimationChange } from "./events.js";
import { currentModel } from "./live2d-loader.js";
import { animationStates, skeletons } from "./spine-loader.js";
import {
  getModelType,
  isModelType,
  setProcessing,
  isProcessing,
} from "../store";
import { getSelectorCurrentState } from "../store/selectors";
import { getGlobalSetting } from "../store/settings";
import { handleResize } from "../mouse";
import {
  setModelState,
  resetModelState,
  getModelState,
} from "../model-transform";
import { getCurrentWindow, PhysicalSize } from "@tauri-apps/api/window";
import { notify } from "../utils";

const RECORDING_MIME_TYPE = "video/webm;codecs=vp8";
const RECORDING_BITRATE = 12000000;
const RECORDING_FRAME_RATE = 60;
let animationDuration = 0;
let recordingStartTime;
let activeCanvas;
let _prevActiveCanvasState;
let backgroundImageToRender = null;
const progressBarContainer = document.getElementById("progressBarContainer");
const progressBar = document.getElementById("progressBar");

async function changeToOriginalSize(
  compositingCanvas,
  modelType,
  currentModel,
  skeletons,
) {
  const modelState = getModelState();
  const prevActiveCanvasState = {
    scale: modelState.scale,
    moveX: modelState.movement.x,
    moveY: modelState.movement.y,
    rotate: modelState.rotate,
    width: activeCanvas.width,
    height: activeCanvas.height,
    styleWidth: activeCanvas.style.width,
    styleHeight: activeCanvas.style.height,
    display: activeCanvas.style.display,
  };
  let originalModelWidth;
  let originalModelHeight;
  if (modelType === "live2d") {
    originalModelWidth = currentModel.internalModel.originalWidth;
    originalModelHeight = currentModel.internalModel.originalHeight;
  } else if (modelType === "spine") {
    originalModelWidth = skeletons["0"].skeleton.data.width;
    originalModelHeight = skeletons["0"].skeleton.data.height;
  }
  const width = Math.round(originalModelWidth);
  const height = Math.round(originalModelHeight);
  await getCurrentWindow().setSize(new PhysicalSize(width, height));
  activeCanvas.width = width;
  activeCanvas.height = height;
  activeCanvas.style.width = width + "px";
  activeCanvas.style.height = height + "px";
  if (compositingCanvas) {
    compositingCanvas.width = width;
    compositingCanvas.height = height;
  }
  resetModelState();
  return { prevActiveCanvasState, originalModelWidth, originalModelHeight };
}

async function restorePreviousSize(
  prevActiveCanvasState,
  modelType,
  currentModel,
) {
  await getCurrentWindow().setSize(
    new PhysicalSize(prevActiveCanvasState.width, prevActiveCanvasState.height),
  );
  activeCanvas.width = prevActiveCanvasState.width;
  activeCanvas.height = prevActiveCanvasState.height;
  activeCanvas.style.width = prevActiveCanvasState.styleWidth;
  activeCanvas.style.height = prevActiveCanvasState.styleHeight;
  activeCanvas.style.display = prevActiveCanvasState.display;
  setModelState(
    prevActiveCanvasState.scale,
    prevActiveCanvasState.moveX,
    prevActiveCanvasState.moveY,
    prevActiveCanvasState.rotate,
  );
  if (modelType === "live2d") {
    currentModel.scale.set(prevActiveCanvasState.scale);
    currentModel.position.set(
      prevActiveCanvasState.moveX,
      prevActiveCanvasState.moveY,
    );
    currentModel.rotation = prevActiveCanvasState.rotate;
  }
  handleResize();
}

async function exportImageOriginalSize(animationName) {
  const tempCanvas = document.createElement("canvas");
  const { prevActiveCanvasState, originalModelWidth, originalModelHeight } =
    await changeToOriginalSize(
      tempCanvas,
      getModelType(),
      currentModel,
      skeletons,
    );
  const backgroundColor = document.body.style.backgroundColor;
  const ctx = tempCanvas.getContext("2d", {
    alpha: !backgroundColor,
  });
  setTimeout(() => {
    const backgroundImage = document.body.style.backgroundImage;
    if (backgroundImage && backgroundImage.startsWith("url")) {
      const imageUrl = backgroundImage.slice(5, -2);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, originalModelWidth, originalModelHeight);
        ctx.drawImage(img, 0, 0, originalModelWidth, originalModelHeight);
        ctx.drawImage(
          activeCanvas,
          0,
          0,
          originalModelWidth,
          originalModelHeight,
        );
        const link = document.createElement("a");
        const selectedSceneText =
          getSelectorCurrentState("scene").selected.label;
        link.download = `${selectedSceneText}_${animationName.split(".")[0]}_original.png`;
        link.href = tempCanvas.toDataURL();
        link.click();
        restorePreviousSize(
          prevActiveCanvasState,
          getModelType(),
          currentModel,
        );
      };
    } else {
      ctx.clearRect(0, 0, originalModelWidth, originalModelHeight);
      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, originalModelWidth, originalModelHeight);
      }
      ctx.drawImage(
        activeCanvas,
        0,
        0,
        originalModelWidth,
        originalModelHeight,
      );
      const link = document.createElement("a");
      const selectedSceneText = getSelectorCurrentState("scene").selected.label;
      link.download = `${selectedSceneText}_${animationName.split(".")[0]}_original.png`;
      link.href = tempCanvas.toDataURL();
      link.click();
      restorePreviousSize(prevActiveCanvasState, getModelType(), currentModel);
    }
  }, 200);
}

function exportImageWindowSize(animationName) {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = activeCanvas.width;
  tempCanvas.height = activeCanvas.height;
  const backgroundColor = document.body.style.backgroundColor;
  const ctx = tempCanvas.getContext("2d", {
    alpha: !backgroundColor,
  });
  const backgroundImage = document.body.style.backgroundImage;
  if (backgroundImage && backgroundImage.startsWith("url")) {
    const imageUrl = backgroundImage.slice(5, -2);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
      ctx.drawImage(img, 0, 0, activeCanvas.width, activeCanvas.height);
      ctx.drawImage(
        activeCanvas,
        0,
        0,
        activeCanvas.width,
        activeCanvas.height,
      );
      const link = document.createElement("a");
      const selectedSceneText = getSelectorCurrentState("scene").selected.label;
      link.download = `${selectedSceneText}_${animationName.split(".")[0]}.png`;
      link.href = tempCanvas.toDataURL();
      link.click();
    };
  } else {
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);
    }
    ctx.drawImage(activeCanvas, 0, 0, activeCanvas.width, activeCanvas.height);
    const link = document.createElement("a");
    const selectedSceneText = getSelectorCurrentState("scene").selected.label;
    link.download = `${selectedSceneText}_${animationName.split(".")[0]}.png`;
    link.href = tempCanvas.toDataURL();
    link.click();
  }
}

// TODO: why earth need check those type?
export function exportImage() {
  let animationName;
  if (isModelType("spine")) {
    animationName = getSelectorCurrentState("animate").selected.value;
  } else if (isModelType("live2d")) {
    animationName = getSelectorCurrentState("animate").selected.label;
  }
  const live2dCanvas = document.getElementById("live2dCanvas");
  const spineCanvas = document.getElementById("spineCanvas");
  activeCanvas = isModelType("live2d") ? live2dCanvas : spineCanvas;
  if (getGlobalSetting("exportAsOriginalSize")) {
    exportImageOriginalSize(animationName);
  } else {
    exportImageWindowSize(animationName);
  }
}

// TODO: why earth need check those type?
export async function exportAnimation() {
  if (isProcessing()) return;
  let animationName;
  if (isModelType("spine")) {
    animationName = getSelectorCurrentState("animate").selected.value;
  } else if (isModelType("live2d")) {
    animationName = getSelectorCurrentState("animate").selected.label;
  }
  await startRecording(animationName);
}

async function startRecording(animationName) {
  setProcessing(true);
  progressBar.style.width = "0%";
  progressBarContainer.style.display = "block";
  const chunks = [];
  const live2dCanvas = document.getElementById("live2dCanvas");
  const spineCanvas = document.getElementById("spineCanvas");
  const exportAsOriginalSize = getGlobalSetting("exportAsOriginalSize");
  activeCanvas = isModelType("live2d") ? live2dCanvas : spineCanvas;
  let compositingCanvas = null;
  let streamSource = activeCanvas;
  const cleanup = (error) => {
    if (error) {
      notify.error("Recording failed:", error);
    }
    if (exportAsOriginalSize && _prevActiveCanvasState) {
      restorePreviousSize(_prevActiveCanvasState, getModelType(), currentModel);
    }
    setProcessing(false);
    progressBarContainer.style.display = "none";
    backgroundImageToRender = null;
    _prevActiveCanvasState = null;
  };
  backgroundImageToRender = null;
  const backgroundColor = document.body.style.backgroundColor;
  const backgroundImage = document.body.style.backgroundImage;
  if (backgroundImage && backgroundImage.startsWith("url")) {
    const imageUrl = backgroundImage.slice(5, -2);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Background image failed to load"));
    });
    backgroundImageToRender = img;
    compositingCanvas = document.createElement("canvas");
    streamSource = compositingCanvas;
  } else if (backgroundColor) {
    compositingCanvas = document.createElement("canvas");
    streamSource = compositingCanvas;
  }
  if (exportAsOriginalSize) {
    if (!compositingCanvas) {
      compositingCanvas = document.createElement("canvas");
    }
    _prevActiveCanvasState = (
      await changeToOriginalSize(
        compositingCanvas,
        getModelType(),
        currentModel,
        skeletons,
      )
    ).prevActiveCanvasState;
  }
  if (compositingCanvas) {
    compositingCanvas.width = activeCanvas.width;
    compositingCanvas.height = activeCanvas.height;
  }
  if (isModelType("live2d")) {
    const [group, index] =
      getSelectorCurrentState("animate").selected.value.split(",");
    const motion =
      currentModel.internalModel.motionManager.motionGroups[group]?.[index];
    if (motion) {
      if ("_loopDurationSeconds" in motion) {
        animationDuration = motion._loopDurationSeconds;
      } else if ("getDurationMSec" in motion) {
        animationDuration = motion.getDurationMSec() / 1000;
      }
    } else {
      animationDuration = 0.1;
    }
  } else if (isModelType("spine")) {
    const track = animationStates[0] && animationStates[0].tracks[0];
    animationDuration = track.animation.duration;
    if (animationDuration <= 0) {
      animationDuration = 0.1;
    }
  }
  if (typeof MediaRecorder === "undefined") {
    notify.error("Video recording is not supported on this platform.");
    cleanup();
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  const stream = streamSource.captureStream(RECORDING_FRAME_RATE);
  const rec = new MediaRecorder(stream, {
    mimeType: RECORDING_MIME_TYPE,
    videoBitsPerSecond: RECORDING_BITRATE,
  });

  rec.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  rec.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    if (blob.size > 0) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const selectedSceneText = getSelectorCurrentState("scene").selected.label;
      link.download = `${selectedSceneText}_${animationName.split(".")[0]}.webm`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
    cleanup();
  };

  rec.onerror = (e) => {
    cleanup(e.error || new Error("MediaRecorder error"));
  };

  if (isModelType("spine")) {
    for (const animationState of animationStates) {
      animationState.tracks[0].trackTime = 0;
    }
    rec.start();
    recordingStartTime = performance.now();
    requestAnimationFrame(() => checkCondition(rec, compositingCanvas));
  } else if (isModelType("live2d")) {
    const [motion, index] =
      getSelectorCurrentState("animate").selected.value.split(",");
    handleLive2DAnimationChange(motion, index);
    setTimeout(() => {
      rec.start();
      recordingStartTime = performance.now();
      requestAnimationFrame(() => checkCondition(rec, compositingCanvas));
    }, 300);
  }
}

function checkCondition(rec, compositingCanvas) {
  if (compositingCanvas) {
    const backgroundColor = document.body.style.backgroundColor;
    const ctx = compositingCanvas.getContext("2d", {
      alpha: !backgroundColor,
    });
    ctx.clearRect(0, 0, compositingCanvas.width, compositingCanvas.height);
    if (backgroundImageToRender) {
      ctx.drawImage(
        backgroundImageToRender,
        0,
        0,
        compositingCanvas.width,
        compositingCanvas.height,
      );
    } else if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, compositingCanvas.width, compositingCanvas.height);
    }
    ctx.drawImage(
      activeCanvas,
      0,
      0,
      compositingCanvas.width,
      compositingCanvas.height,
    );
  }
  let progress = 0;
  if (isModelType("spine")) {
    const track = animationStates[0].tracks[0];
    if (track.trackTime >= track.animationEnd) {
      rec.stop();
    } else {
      progress = (track.trackTime / track.animationEnd) * 100;
      requestAnimationFrame(() => checkCondition(rec, compositingCanvas));
    }
  } else if (isModelType("live2d")) {
    const elapsedTime = (performance.now() - recordingStartTime) / 1000;
    if (elapsedTime >= animationDuration) {
      rec.stop();
    } else {
      progress = (elapsedTime / animationDuration) * 100;
      requestAnimationFrame(() => checkCondition(rec, compositingCanvas));
    }
  }
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}
