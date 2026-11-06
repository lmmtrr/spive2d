<script module>
  export const ROW_HEIGHT = 26;
  export const TEXT_INSET = 18;

  export function listMaxHeight(top) {
    return Math.max(4, Math.floor((window.innerHeight - top) / ROW_HEIGHT)) * ROW_HEIGHT;
  }
</script>

<script>
  import { untrack } from 'svelte';

  const OVERSCAN = 10;
  const MEASURE_LIMIT = 300;
  const MIN_THUMB = 24;

  let {
    id = undefined,
    options = [],
    value,
    maxHeight = undefined,
    hoverIndex = -1,
    role = 'main',
    minWidth = 0,
  } = $props();

  let listEl = $state();
  let scrollTop = $state(0);
  let viewHeight = $state(0);

  const indexByValue = $derived.by(() => {
    const map = new Map();
    options.forEach((o, i) => map.set(String(o.value), i));
    return map;
  });
  const selectedIndex = $derived(indexByValue.get(String(value)) ?? -1);

  const start = $derived(Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN));
  const end = $derived(Math.min(options.length, Math.ceil((scrollTop + viewHeight) / ROW_HEIGHT) + OVERSCAN));
  const visible = $derived(options.slice(start, end));

  const widestOption = $derived.by(() => (listEl ? findWidestOption(options) : options[0]));

  function findWidestOption(list) {
    if (list.length <= 1) return list[0];
    const weights = new Array(list.length);
    let maxWeight = 0;
    for (let i = 0; i < list.length; i++) {
      const label = String(list[i].label ?? '');
      let w = label.length;
      for (let j = 0; j < label.length; j++) if (label.charCodeAt(j) > 0x2e7f) w++;
      weights[i] = w;
      if (w > maxWeight) maxWeight = w;
    }
    const candidates = [];
    for (let i = 0; i < list.length && candidates.length < MEASURE_LIMIT; i++) {
      if (weights[i] >= maxWeight * 0.8) candidates.push(list[i]);
    }
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return candidates[0];
    const sample = listEl.querySelector('.option:not(.sizer)') ?? listEl;
    const fontStyle = getComputedStyle(sample);
    ctx.font = `${fontStyle.fontWeight} ${fontStyle.fontSize} ${fontStyle.fontFamily}`;
    let widest = candidates[0];
    let widestWidth = -1;
    for (const o of candidates) {
      const w = ctx.measureText(String(o.label ?? '')).width + (o.icon ? 20 : 0);
      if (w > widestWidth) {
        widestWidth = w;
        widest = o;
      }
    }
    return widest;
  }

  function handleScroll() {
    scrollTop = listEl.scrollTop;
  }

  function setScroll(px) {
    if (!listEl) return;
    const max = Math.max(0, listEl.scrollHeight - listEl.clientHeight);
    listEl.scrollTop = Math.min(max, Math.max(0, Math.round(px / ROW_HEIGHT) * ROW_HEIGHT));
    scrollTop = listEl.scrollTop;
  }

  function centerSelected() {
    const index = selectedIndex;
    if (index >= 0) setScroll(index * ROW_HEIGHT - (listEl.clientHeight - ROW_HEIGHT) / 2);
    else setScroll(listEl.scrollTop);
  }

  export function centerIndex(index) {
    if (listEl && index >= 0) setScroll(index * ROW_HEIGHT - (listEl.clientHeight - ROW_HEIGHT) / 2);
  }

  $effect(() => {
    const el = listEl;
    if (!el) return;
    const limit = maxHeight;
    untrack(() => {
      el.style.maxHeight = `${limit ?? listMaxHeight(el.getBoundingClientRect().top)}px`;
      viewHeight = el.clientHeight;
    });
  });

  $effect(() => {
    const el = listEl;
    if (!el) return;
    untrack(centerSelected);
    const frame = requestAnimationFrame(() => {
      if (listEl === el) centerSelected();
    });
    return () => cancelAnimationFrame(frame);
  });

  let lastOptions;

  const sameOptions = (a, b) =>
    a.length === b.length && a.every((o, i) => String(o.value) === String(b[i].value) && o.label === b[i].label);

  $effect(() => {
    const list = options;
    if (!listEl) return;
    if (lastOptions !== undefined && lastOptions !== list && !sameOptions(lastOptions, list)) untrack(centerSelected);
    lastOptions = list;
  });

  $effect(() => {
    const el = listEl;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      viewHeight = el.clientHeight;
    });
    observer.observe(el);
    return () => observer.disconnect();
  });

  $effect(() => {
    const index = selectedIndex;
    if (!listEl || index < 0) return;
    untrack(() => {
      const top = index * ROW_HEIGHT;
      if (top < listEl.scrollTop) setScroll(top);
      else if (top + ROW_HEIGHT > listEl.scrollTop + listEl.clientHeight) setScroll(top + ROW_HEIGHT - listEl.clientHeight);
    });
  });

  let wheelCarry = 0;

  export function wheel(e) {
    if (!listEl) return;
    const scale = e.deltaMode === 1 ? ROW_HEIGHT : e.deltaMode === 2 ? listEl.clientHeight : 1;
    wheelCarry += e.deltaY * scale;
    const rows = Math.trunc(wheelCarry / ROW_HEIGHT);
    if (!rows) return;
    wheelCarry -= rows * ROW_HEIGHT;
    setScroll(listEl.scrollTop + rows * ROW_HEIGHT);
  }

  let trackEl = $state();

  const contentHeight = $derived(options.length * ROW_HEIGHT);
  const scrollable = $derived(viewHeight > 0 && contentHeight > viewHeight + 1);
  const thumbHeight = $derived(Math.min(viewHeight, Math.max(MIN_THUMB, (viewHeight * viewHeight) / Math.max(1, contentHeight))));
  const thumbTop = $derived.by(() => {
    const max = contentHeight - viewHeight;
    if (max <= 0) return 0;
    return (Math.min(max, Math.max(0, scrollTop)) / max) * (viewHeight - thumbHeight);
  });
  let drag = $state(null);

  function trackY(e) {
    return e.clientY - trackEl.getBoundingClientRect().top;
  }

  function handleTrackPointerDown(e) {
    if (e.button !== 0 || !scrollable) return;
    const y = trackY(e);
    const onThumb = y >= thumbTop && y < thumbTop + thumbHeight;
    drag = { offset: onThumb ? y - thumbTop : thumbHeight / 2 };
    trackEl.setPointerCapture(e.pointerId);
    scrollToThumb(y);
  }

  function handleTrackPointerMove(e) {
    if (drag) scrollToThumb(trackY(e));
  }

  function endDrag() {
    drag = null;
  }

  function scrollToThumb(y) {
    const range = viewHeight - thumbHeight;
    if (!drag || !listEl || range <= 0) return;
    const top = Math.min(range, Math.max(0, y - drag.offset));
    setScroll((top / range) * (contentHeight - viewHeight));
  }
</script>

{#snippet icon(path)}
  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={path} /></svg>
{/snippet}

<div class="list" style:--row="{ROW_HEIGHT}px" style:min-width="{minWidth}px">
  <div class="scroll" {id} role="listbox" data-hover-list={role} bind:this={listEl} onscroll={handleScroll}>
    <div class="rows" style:height="{options.length * ROW_HEIGHT}px" style:padding-top="{start * ROW_HEIGHT}px">
      {#each visible as option, k (option.value)}
        {@const i = start + k}
        <div class="row">
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <div class="option" class:selected={i === selectedIndex} class:hover={i === hoverIndex} role="option" aria-selected={i === selectedIndex}
          ><span class="label">{#if option.icon}{@render icon(option.icon)}{/if}{option.label}</span></div>
        </div>
      {/each}
    </div>
    {#if widestOption}
      <div class="option sizer" aria-hidden="true"><span class="label">{#if widestOption.icon}{@render icon(widestOption.icon)}{/if}{widestOption.label}</span></div>
    {/if}
  </div>
  {#if scrollable}
    <div class="scrollbar" aria-hidden="true">
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="track" class:dragging={drag} bind:this={trackEl}
        onmousedown={(e) => e.preventDefault()}
        onpointerdown={handleTrackPointerDown}
        onpointermove={handleTrackPointerMove}
        onpointerup={endDrag}
        onlostpointercapture={endDrag}
      >
        <div class="thumb" style:top="{thumbTop}px" style:height="{thumbHeight}px"></div>
      </div>
    </div>
  {/if}
</div>

<style>
  .list {
    pointer-events: none;
    position: relative;
    width: max-content;
    min-width: 0;
    max-width: 100%;
  }

  .scroll {
    max-height: 60vh;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    padding-left: 12px;
    box-sizing: border-box;
  }

  .scroll::-webkit-scrollbar {
    display: none;
  }

  .scrollbar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 12px;
    z-index: 1;
    pointer-events: none;
  }

  .track {
    position: relative;
    height: 100%;
    background: var(--scroll-track-color);
    border-radius: 10px;
    pointer-events: auto;
    touch-action: none;
  }

  .thumb {
    position: absolute;
    left: 0;
    right: 0;
    box-sizing: border-box;
    background: var(--scroll-thumb-color);
    border: var(--scroll-thumb-border);
    border-radius: 10px;
  }

  .track:hover .thumb,
  .track.dragging .thumb {
    background: var(--scroll-thumb-hover-color);
  }

  .rows {
    box-sizing: border-box;
  }

  .row {
    height: var(--row);
    position: relative;
  }

  .option {
    box-sizing: border-box;
    height: var(--row);
    line-height: 19px;
    padding: 3px 8px 3px 2px;
    font-size: var(--ui-font-size);
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;
    user-select: none;
    border-radius: 4px;
    text-shadow: 0 0 2px #000, 0 0 4px #000;
  }

  .icon {
    width: 14px;
    height: 14px;
    margin-right: 6px;
    vertical-align: -2px;
    fill: currentColor;
    filter: drop-shadow(0 0 1px #000);
    flex-shrink: 0;
  }

  .option.sizer {
    position: static;
    height: 0;
    padding-top: 0;
    padding-bottom: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .option {
    pointer-events: none;
  }

  .label {
    display: inline-block;
    max-width: 100%;
    padding: 0 4px;
    border-radius: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
  }

  .option.hover .label {
    background: rgba(255, 255, 255, 0.4);
  }

  .option.selected .label {
    background: rgba(255, 255, 255, 0.85);
    color: #000;
    text-shadow: none;
  }

  .option.selected.hover .label {
    background: rgba(255, 255, 255, 0.95);
  }
</style>
