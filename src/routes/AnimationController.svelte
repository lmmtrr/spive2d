<script>
  import { appState } from '$lib/appState.svelte.js';
  import { getRenderer } from '$lib/rendererStore.js';
  import { formatFrames } from '$lib/utils.js';

  let visible = $state(false);
  let seekerValue = $state(0);
  let timeDisplay = $state('0 / 0');
  let animRequestId;

  $effect(() => {
    animRequestId = requestAnimationFrame(updateUI);
    return () => {
      if (animRequestId) cancelAnimationFrame(animRequestId);
    };
  });

  export function showOnHover(clientY) {
    visible = window.innerHeight - clientY < 80 || appState.animation.seeking;
  }

  export function resetProgress() {
    seekerValue = 0;
    timeDisplay = '0 / 0';
    appState.animation.seekProgress = 0;
  }

  function updateUI() {
    const renderer = getRenderer();
    if (renderer && renderer.setSpeed) {
      if (renderer._currentSpeed !== appState.animation.speed) {
        renderer.setSpeed(appState.animation.speed);
        renderer._currentSpeed = appState.animation.speed;
      }
    }
    if (!appState.animation.seeking && renderer) {
      const duration = renderer.getAnimationDuration();
      const currentTime = renderer.getCurrentTime();
      if (duration > 0) {
        seekerValue = (currentTime / duration) * 100;
        const fps = renderer.getFPS();
        timeDisplay = formatFrames(currentTime, duration, fps);
        if (!appState.animation.paused) {
          appState.animation.seekProgress = currentTime / duration;
        }
      } else {
        timeDisplay = '0 / 0';
      }
    }
    animRequestId = requestAnimationFrame(updateUI);
  }

  function handleSeekerMouseDown() {
    appState.animation.seeking = true;
    appState.animation.paused = true;
    getRenderer()?.setPaused(true);
  }

  function handleSeekerInput(e) {
    const progress = e.target.value / 100;
    seekerValue = e.target.value;
    appState.animation.seekProgress = progress;
    const renderer = getRenderer();
    renderer?.seekAnimation(progress);
    const duration = renderer?.getAnimationDuration() || 0;
    if (duration > 0) {
      const fps = renderer?.getFPS() || 30;
      timeDisplay = formatFrames(progress * duration, duration, fps);
    }
  }

  function handleSpeedInput(e) {
    const newSpeed = parseFloat(e.target.value);
    appState.animation.speed = newSpeed;
    const renderer = getRenderer();
    renderer?.setSpeed?.(newSpeed);
  }

  function blurActiveElement() {
    document.activeElement?.blur();
  }

  function handleGlobalMouseUp() {
    if (appState.animation.seeking) {
      appState.animation.seeking = false;
    }
  }

  $effect(() => {
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  });

  function togglePlayPause() {
    const newPaused = !appState.animation.paused;
    appState.animation.paused = newPaused;
    const renderer = getRenderer();
    if (!newPaused && renderer?.resumeFromProgress) {
      renderer.resumeFromProgress(appState.animation.seekProgress);
    } else {
      renderer?.setPaused(newPaused);
    }
  }

</script>

<div id="animationController" class:show={visible}>
  <button class="icon-button" onclick={togglePlayPause}>
    {#if appState.animation.paused}
      <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
        <path d="M8 5v14l11-7z" />
      </svg>
    {:else}
      <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </svg>
    {/if}
  </button>
  <input
    type="range"
    id="animationSeeker"
    min="0"
    max="100"
    value={seekerValue}
    onmousedown={handleSeekerMouseDown}
    oninput={handleSeekerInput}
    onchange={blurActiveElement}
  />
  <div id="animationTimeDisplay">{timeDisplay}</div>
  <div class="divider"></div>
  <div class="speed-control">
    <span class="speed-label">Speed: {appState.animation.speed.toFixed(1)}x</span>
    <input
      type="range"
      min="0.1"
      max="3.0"
      step="0.1"
      value={appState.animation.speed}
      oninput={handleSpeedInput}
      onchange={blurActiveElement}
      class="speed-slider"
    />
  </div>
</div>

<style>
  #animationController {
    position: fixed;
    bottom: -60px;
    left: var(--sidebar-width);
    right: var(--sidebar-width);
    background: var(--sidebar-color);
    padding: 10px 20px;
    border-radius: 12px 12px 0 0;
    border: var(--border-color);
    border-bottom: none;
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 2000;
    backdrop-filter: blur(8px);
    transition: bottom 0.2s;
  }

  #animationController.show {
    bottom: 0;
  }

  .icon-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  }

  .icon-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .icon-button svg {
    display: block;
  }

  #animationSeeker {
    flex-grow: 1;
    -webkit-appearance: none;
    appearance: none;
    background: #555;
    height: 6px;
    border-radius: 3px;
    outline: none;
  }

  #animationSeeker::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #39d;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }

  #animationTimeDisplay {
    font-family: monospace;
    font-size: 14px;
    min-width: 100px;
    text-align: right;
    text-shadow: var(--text-shadow);
  }

  .divider {
    width: 1px;
    height: 24px;
    background: rgba(255, 255, 255, 0.2);
    margin: 0 5px;
  }

  .speed-control {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 150px;
  }

  .speed-label {
    font-family: monospace;
    font-size: 14px;
    text-shadow: var(--text-shadow);
    white-space: nowrap;
    width: 90px;
  }

  .speed-slider {
    flex-grow: 1;
    -webkit-appearance: none;
    appearance: none;
    background: #555;
    height: 6px;
    border-radius: 3px;
    outline: none;
    width: 80px;
  }

  .speed-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    background: #39d;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
</style>
