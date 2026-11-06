<script>
  import { onMount } from 'svelte';
  import { appState } from '#lib/appState.svelte.js';
  import { getRenderer } from '#lib/rendererStore.svelte.js';

  const STROKE_COLOR = '#ff5a8a';
  const FILL_COLOR = 'rgba(255, 90, 138, 0.15)';
  const LABEL_BACKGROUND = 'rgba(0, 0, 0, 0.7)';
  const LINE_PX = 1.5;

  let canvas = $state();
  let frame = 0;
  let painted = false;

  function clear() {
    if (!painted || !canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    painted = false;
  }

  function paint() {
    frame = requestAnimationFrame(paint);
    const renderer = getRenderer();
    if (!canvas || !appState.showHitAreas || !appState.initialized || appState.processing || typeof renderer?.getHitAreas !== 'function') {
      clear();
      return;
    }
    let areas = [];
    try {
      areas = renderer.getHitAreas() ?? [];
    } catch (e) {
      console.warn('[hitAreas]', e);
    }
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(window.innerWidth * dpr));
    const height = Math.max(1, Math.round(window.innerHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    painted = areas.length > 0;
    if (!painted) return;
    const rect = renderer.getCanvas().getBoundingClientRect();
    ctx.setTransform(dpr, 0, 0, dpr, rect.left * dpr, rect.top * dpr);
    ctx.lineWidth = LINE_PX;
    ctx.font = `${getComputedStyle(document.documentElement).getPropertyValue('--ui-font-size').trim() || '12px'} sans-serif`;
    ctx.textBaseline = 'top';
    for (const { name, polygon } of areas) {
      ctx.beginPath();
      ctx.moveTo(polygon[0], polygon[1]);
      for (let k = 2; k + 1 < polygon.length; k += 2) ctx.lineTo(polygon[k], polygon[k + 1]);
      ctx.closePath();
      ctx.fillStyle = FILL_COLOR;
      ctx.fill();
      ctx.strokeStyle = STROKE_COLOR;
      ctx.stroke();
      let x = Infinity;
      let y = Infinity;
      for (let k = 0; k + 1 < polygon.length; k += 2) {
        if (polygon[k + 1] < y || (polygon[k + 1] === y && polygon[k] < x)) {
          x = polygon[k];
          y = polygon[k + 1];
        }
      }
      const metrics = ctx.measureText(name);
      const labelHeight = (metrics.actualBoundingBoxDescent || 10) + 4;
      ctx.fillStyle = LABEL_BACKGROUND;
      ctx.fillRect(x, y, metrics.width + 6, labelHeight);
      ctx.fillStyle = STROKE_COLOR;
      ctx.fillText(name, x + 3, y + 2);
    }
  }

  onMount(() => {
    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  });
</script>

<canvas class="hit-area-overlay" bind:this={canvas}></canvas>

<style>
  .hit-area-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }
</style>
