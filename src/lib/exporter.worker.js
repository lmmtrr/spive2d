import { Output, WebMOutputFormat, BufferTarget, CanvasSource } from 'mediabunny';

let currentTasks = {};

self.onmessage = async (e) => {
  const { type, id, ...payload } = e.data;
  if (type === 'CANCEL') {
    if (currentTasks[id]) {
      currentTasks[id].cancelled = true;
      if (currentTasks[id].output) {
        try {
          await currentTasks[id].output.finalize();
        } catch (err) {
        }
      }
      delete currentTasks[id];
    }
    return;
  }
  if (type === 'START_VIDEO') {
    const { width, height, bitrate, fps } = payload;
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const output = new Output({
      format: new WebMOutputFormat(),
      target: new BufferTarget()
    });
    let videoSource;
    try {
      videoSource = new CanvasSource(canvas, {
        codec: 'vp9',
        bitrate: bitrate,
      });
    } catch (err) {
      self.postMessage({ type: 'ERROR', id, error: 'Codec not supported' });
      return;
    }
    output.addVideoTrack(videoSource);
    currentTasks[id] = {
      canvas,
      ctx,
      output,
      videoSource,
      fps,
      cancelled: false
    };
    try {
      await output.start();
      self.postMessage({ type: 'STARTED', id });
    } catch (err) {
      delete currentTasks[id];
      self.postMessage({ type: 'ERROR', id, error: err.message });
    }
    return;
  }
  if (type === 'ADD_FRAME_VIDEO') {
    const task = currentTasks[id];
    if (!task || task.cancelled) return;
    const { bitmap, time } = payload;
    task.ctx.clearRect(0, 0, task.canvas.width, task.canvas.height);
    task.ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    try {
      await task.videoSource.add(time, 1 / task.fps);
      self.postMessage({ type: 'FRAME_ADDED', id });
    } catch (err) {
      self.postMessage({ type: 'ERROR', id, error: err.message });
    }
    return;
  }
  if (type === 'FINISH_VIDEO') {
    const task = currentTasks[id];
    if (!task || task.cancelled) return;
    try {
      await task.output.finalize();
      const buffer = task.output.target.buffer;
      self.postMessage({ type: 'DONE_VIDEO', id, buffer }, { transfer: [buffer] });
    } catch (err) {
      self.postMessage({ type: 'ERROR', id, error: err.message });
    } finally {
      delete currentTasks[id];
    }
    return;
  }
  if (type === 'PROCESS_FRAME_PNG') {
    const { bitmap, frameIndex } = payload;
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    try {
      const blob = await canvas.convertToBlob({ type: 'image/png' });
      const buffer = await blob.arrayBuffer();
      self.postMessage({ type: 'FRAME_PNG_DONE', id, frameIndex, buffer }, { transfer: [buffer] });
    } catch (err) {
      self.postMessage({ type: 'ERROR', id, error: err.message });
    }
    return;
  }
};
