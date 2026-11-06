<script>
  import { onMount, tick as afterUpdate } from 'svelte';
  import { appState } from '#lib/appState.svelte.js';
  import { getRenderer } from '#lib/rendererStore.svelte.js';
  import { isPickModifier, isViewerPoint } from '#lib/inputAction.js';
  import { rasterizeTextured } from '#lib/pick.js';

  let { dialogOpen = false, onChange } = $props();

  const PICK_INTERVAL_MS = 50;
  const PICK_COST_FACTOR = 2;
  const OUTLINE_PX = 1.5;
  const SHOWN_COLOR = '#3fa9ff';
  const HIDDEN_COLOR = '#ffffff';
  const FILL_ALPHA = 0.35;
  const MENU_OFFSET = 16;
  const RING_OFFSETS = [[1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7]];

  let canvas = $state();
  let menuEl = $state();
  let menu = $state(null);
  let selectedId = $state(null);

  const mask = document.createElement('canvas');
  const ring = document.createElement('canvas');
  const low = document.createElement('canvas');
  let pointer = null;
  let modifier = false;
  let items = [];
  let pickedAt = null;
  let itemsRenderer = null;
  let rect = null;
  let drawn = null;
  let highlighter = null;
  let frame = 0;
  let lastPick = -Infinity;
  let interval = PICK_INTERVAL_MS;
  let dirty = false;
  let moved = false;
  let frozen = false;
  let inFlight = false;
  let queue = Promise.resolve();

  function isActive() {
    if (!modifier || !pointer || !appState.initialized || appState.processing || !getRenderer() || dialogOpen) return false;
    return isViewerPoint(pointer.x, pointer.y);
  }

  function defaultSelection(list) {
    const shown = list.find((item) => !item.hidden);
    return (shown ?? list[list.length - 1])?.id ?? null;
  }

  async function pick() {
    if (!isActive()) return;
    const start = performance.now();
    const renderer = getRenderer();
    const canvasRect = renderer.getCanvas().getBoundingClientRect();
    let list = [];
    try {
      list = (await renderer.pickTargets?.(pointer.x - canvasRect.left, pointer.y - canvasRect.top, appState.propertyCategory)) ?? [];
    } catch (e) {
      console.warn('[pick]', e);
    }
    interval = Math.max(PICK_INTERVAL_MS, (performance.now() - start) * PICK_COST_FACTOR);
    if (renderer !== getRenderer() || !isActive()) {
      clear();
      return;
    }
    const samePlace = pickedAt && pickedAt.x === pointer.x && pickedAt.y === pointer.y && itemsRenderer === renderer;
    if (samePlace && frozen) {
      const fresh = new Map(list.map((item) => [item.id, item]));
      list = items.map((item) => fresh.get(item.id) ?? item);
    } else if (samePlace) {
      const previous = new Map(items.map((item, i) => [item.id, i]));
      const rank = (item, i) => previous.get(item.id) ?? items.length + i;
      list = list.map((item, i) => ({ item, key: rank(item, i) })).sort((a, b) => a.key - b.key).map(({ item }) => item);
    }
    pickedAt = { x: pointer.x, y: pointer.y };
    items = list;
    itemsRenderer = renderer;
    rect = canvasRect;
    if (!list.some((item) => item.id === selectedId)) selectedId = defaultSelection(list);
    menu = list.length > 0
      ? { x: pointer.x, y: pointer.y, rows: list.map((item) => ({ id: item.id, name: item.name, hidden: item.hidden, range: item.range ?? null })) }
      : null;
    showSelection();
  }

  function queuePick() {
    const next = queue.then(pick);
    queue = next.catch(() => {});
    return next;
  }

  function selectedItem() {
    return items.find((item) => item.id === selectedId) ?? null;
  }

  function showSelection() {
    const item = selectedItem();
    const triangles = item?.triangles ?? null;
    if (!drawn || drawn.id !== item?.id || drawn.hidden !== item?.hidden || drawn.triangles !== triangles) {
      drawn = item ? { id: item.id, hidden: item.hidden, triangles } : null;
      draw(item, triangles);
    }
    if (itemsRenderer?.setPickHighlight) {
      highlighter = itemsRenderer;
      itemsRenderer.setPickHighlight(item);
    }
    afterUpdate().then(() => menuEl?.querySelector('.selected')?.scrollIntoView({ block: 'nearest' }));
  }

  function resize(target, width, height) {
    if (target.width !== width || target.height !== height) {
      target.width = width;
      target.height = height;
    }
  }

  function paintTriangles(m, triangles, dpr, color) {
    m.setTransform(dpr, 0, 0, dpr, rect.left * dpr, rect.top * dpr);
    m.beginPath();
    for (let i = 0; i + 5 < triangles.length; i += 6) {
      const ax = triangles[i], ay = triangles[i + 1];
      let bx = triangles[i + 2], by = triangles[i + 3];
      let cx = triangles[i + 4], cy = triangles[i + 5];
      if ((bx - ax) * (cy - ay) - (by - ay) * (cx - ax) < 0) {
        [bx, by, cx, cy] = [cx, cy, bx, by];
      }
      m.moveTo(ax, ay);
      m.lineTo(bx, by);
      m.lineTo(cx, cy);
      m.closePath();
    }
    m.fillStyle = color;
    m.fill('nonzero');
    m.setTransform(1, 0, 0, 1, 0, 0);
  }

  function paintTextured(m, chunks, dpr, color) {
    const w = Math.max(1, Math.ceil(window.innerWidth));
    const h = Math.max(1, Math.ceil(window.innerHeight));
    const { coverage, bounds } = rasterizeTextured(chunks, w, h, rect.left, rect.top);
    if (bounds.maxX < bounds.minX) return false;
    const bw = bounds.maxX - bounds.minX + 1;
    const bh = bounds.maxY - bounds.minY + 1;
    const image = new ImageData(bw, bh);
    const data = image.data;
    for (let y = 0; y < bh; y++) {
      const row = (y + bounds.minY) * w + bounds.minX;
      for (let x = 0; x < bw; x++) {
        if (coverage[row + x]) data[(y * bw + x) * 4 + 3] = 255;
      }
    }
    resize(low, bw, bh);
    low.getContext('2d').putImageData(image, 0, 0);
    m.imageSmoothingEnabled = true;
    m.drawImage(low, bounds.minX * dpr, bounds.minY * dpr, bw * dpr, bh * dpr);
    m.globalCompositeOperation = 'source-in';
    m.fillStyle = color;
    m.fillRect(0, 0, mask.width, mask.height);
    m.globalCompositeOperation = 'source-over';
    return true;
  }

  function draw(item, triangles) {
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(window.innerWidth * dpr));
    const height = Math.max(1, Math.round(window.innerHeight * dpr));
    for (const target of [canvas, mask, ring]) resize(target, width, height);
    const out = canvas.getContext('2d');
    out.clearRect(0, 0, width, height);
    if (!item || !triangles || triangles.length < 6 || !rect) return;
    const m = mask.getContext('2d');
    m.setTransform(1, 0, 0, 1, 0, 0);
    m.clearRect(0, 0, width, height);
    const chunks = item.textured ?? null;
    if (chunks) {
      if (!paintTextured(m, chunks, dpr, item.hidden ? HIDDEN_COLOR : SHOWN_COLOR)) return;
    } else {
      paintTriangles(m, triangles, dpr, item.hidden ? HIDDEN_COLOR : SHOWN_COLOR);
    }
    const r = ring.getContext('2d');
    r.globalCompositeOperation = 'source-over';
    r.clearRect(0, 0, width, height);
    const d = Math.max(1, OUTLINE_PX * dpr);
    for (const [dx, dy] of RING_OFFSETS) r.drawImage(mask, dx * d, dy * d);
    r.globalCompositeOperation = 'destination-out';
    r.drawImage(mask, 0, 0);
    r.globalCompositeOperation = 'source-over';
    if (!item.hidden) {
      out.globalAlpha = FILL_ALPHA;
      out.drawImage(mask, 0, 0);
      out.globalAlpha = 1;
    }
    out.shadowColor = 'rgba(0, 0, 0, 0.8)';
    out.shadowBlur = 2 * dpr;
    out.drawImage(ring, 0, 0);
    out.shadowBlur = 0;
    out.shadowColor = 'transparent';
  }

  function clear() {
    frozen = false;
    highlighter?.setPickHighlight?.(null);
    highlighter = null;
    items = [];
    pickedAt = null;
    itemsRenderer = null;
    selectedId = null;
    menu = null;
    if (drawn) {
      drawn = null;
      canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function tick(now) {
    frame = 0;
    if (!isActive()) {
      clear();
      return;
    }
    const due = now - lastPick >= interval && (moved || !getRenderer()?.pickOnMoveOnly);
    if (!inFlight && (dirty || due)) {
      dirty = false;
      moved = false;
      inFlight = true;
      queuePick().finally(() => {
        inFlight = false;
        lastPick = performance.now();
      });
    }
    frame = requestAnimationFrame(tick);
  }

  function schedule(immediate = true) {
    if (immediate) dirty = true;
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function toggleSelected() {
    const item = selectedItem();
    if (!item || itemsRenderer !== getRenderer()) return;
    if (item.range) return;
    itemsRenderer.setTargetHidden(item.id, !item.hidden);
    onChange?.();
    schedule();
  }

  function stepSelected(direction) {
    const item = selectedItem();
    if (!item?.range || itemsRenderer !== getRenderer()) return;
    const { min, max, value, step } = item.range;
    const next = Math.min(max, Math.max(min, value + direction * step));
    item.range = { ...item.range, value: next };
    frozen = true;
    if (menu) menu = { ...menu, rows: menu.rows.map((row) => (row.id === item.id ? { ...row, range: item.range } : row)) };
    itemsRenderer.setTargetValue?.(item.id, next);
    onChange?.();
    schedule();
  }

  function moveSelection(delta) {
    if (items.length === 0) return;
    const index = items.findIndex((item) => item.id === selectedId);
    const next = index < 0 ? 0 : (index + delta + items.length) % items.length;
    selectedId = items[next].id;
    showSelection();
  }

  function handleMouseMove(e) {
    if (e.clientX !== pointer?.x || e.clientY !== pointer?.y) frozen = false;
    pointer = { x: e.clientX, y: e.clientY, target: e.target };
    modifier = isPickModifier(e);
    moved = true;
    schedule(false);
  }

  async function handleMouseDown(e) {
    pointer = { x: e.clientX, y: e.clientY, target: e.target };
    modifier = isPickModifier(e);
    if (e.button !== 0 || !isActive()) return;
    e.preventDefault();
    await queuePick();
    toggleSelected();
  }

  function handleKeyDown(e) {
    if (e.key === 'Control' || e.key === 'Meta') {
      modifier = isPickModifier(e);
      schedule();
      return;
    }
    if (!menu || !isActive()) return;
    const toggle = e.key === 'Enter' || e.key === 'ArrowLeft' || e.key === 'ArrowRight';
    if (!toggle && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (selectedItem()?.range && e.key !== 'Enter' && toggle) {
      stepSelected(e.key === 'ArrowLeft' ? -1 : 1);
    } else if (toggle) {
      if (!e.repeat) toggleSelected();
    } else {
      moveSelection(e.key === 'ArrowUp' ? -1 : 1);
    }
  }

  function handleKeyUp(e) {
    if (e.key !== 'Control' && e.key !== 'Meta') return;
    modifier = isPickModifier(e);
    schedule();
  }

  function handleBlur() {
    modifier = false;
    clear();
  }

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      clear();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  });

  const flipX = $derived(!!menu && menu.x > window.innerWidth * 0.6);
  const flipY = $derived(!!menu && menu.y > window.innerHeight * 0.6);
</script>

<canvas class="pick-overlay" bind:this={canvas}></canvas>
{#if menu}
  <ul
    class="pick-menu"
    bind:this={menuEl}
    style:left={flipX ? null : `${menu.x + MENU_OFFSET}px`}
    style:right={flipX ? `${window.innerWidth - menu.x + MENU_OFFSET}px` : null}
    style:top={flipY ? null : `${menu.y + MENU_OFFSET}px`}
    style:bottom={flipY ? `${window.innerHeight - menu.y + MENU_OFFSET}px` : null}
  >
    {#each menu.rows as row (row.id)}
      <li class:selected={row.id === selectedId} class:hidden={row.hidden} class:ranged={!!row.range}>
        {#if row.range}
          <span class="name">{row.name}</span>
          <span class="bar"><span class="fill" style:width={`${row.range.max > row.range.min ? ((row.range.value - row.range.min) / (row.range.max - row.range.min)) * 100 : 0}%`}></span></span>
          <span class="value">{Number(row.range.value).toFixed(2)}</span>
        {:else}
          <span class="state">{row.hidden ? '○' : '●'}</span>{row.name}
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .pick-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  .pick-menu {
    position: fixed;
    z-index: 90;
    max-width: 60vw;
    max-height: 40vh;
    margin: 0;
    padding: 2px 0;
    overflow-y: auto;
    list-style: none;
    border: 1px solid #999;
    border-radius: 4px;
    background: #000c;
    color: var(--text-color);
    font-size: var(--ui-font-size);
    pointer-events: none;
  }

  .pick-menu li {
    padding: 1px 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .pick-menu li.hidden {
    opacity: 0.6;
  }

  .pick-menu li.selected {
    background: #3fa9ff55;
    opacity: 1;
  }

  .pick-menu li.ranged {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .name {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bar {
    flex: 0 0 80px;
    height: 4px;
    border-radius: 2px;
    background: #ffffff33;
    overflow: hidden;
  }

  .fill {
    display: block;
    height: 100%;
    background: #3fa9ff;
  }

  .value {
    flex: 0 0 auto;
    min-width: 3.5em;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .state {
    display: inline-block;
    width: 1.2em;
  }
</style>
