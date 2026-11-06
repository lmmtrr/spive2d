<script>
  import HoverList, { ROW_HEIGHT, TEXT_INSET } from './HoverList.svelte';

  let {
    id = undefined,
    value,
    options = [],
    disabled = false,
    onchange = undefined,
    companion = undefined,
    class: className = '',
  } = $props();

  const listId = $props.id();
  let open = $state(false);
  let rootEl;
  let currentEl;
  let layerEl = $state();
  let layerStyle = $state('');
  let layerLeft = $state(0);
  let availHeight = $state(0);

  const indexByValue = $derived.by(() => {
    const map = new Map();
    options.forEach((o, i) => map.set(String(o.value), i));
    return map;
  });
  const selectedIndex = $derived(indexByValue.get(String(value)) ?? -1);
  const currentLabel = $derived(options[selectedIndex]?.label ?? '');
  const currentIcon = $derived(options[selectedIndex]?.icon);

  const hasCompanion = $derived((companion?.options?.length ?? 0) > 1);
  const canOpen = $derived(!disabled && (options.length > 1 || hasCompanion));

  $effect(() => {
    if (!canOpen) open = false;
  });

  function portal(node) {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  }

  let hoverMain = $state(-1);
  let keyList = 'main';
  let hoverSide = $state(-1);
  let lastPointer = null;

  function zone() {
    if (!rootEl || !layerEl) return null;
    const root = rootEl.getBoundingClientRect();
    const sidebar = rootEl.closest('#sidebar')?.getBoundingClientRect();
    const mainEl = layerEl.querySelector('[data-hover-list="main"]');
    const left = Math.min(root.left, mainEl ? mainEl.getBoundingClientRect().left : Infinity, sidebar ? sidebar.left : Infinity);
    const right = sidebar ? Math.max(root.right, sidebar.right) : root.right;
    return { left, right, top: root.bottom, bottom: window.innerHeight };
  }

  function inZone(x, y) {
    const z = zone();
    return !!z && x >= z.left && x < z.right && y >= z.top && y < z.bottom;
  }

  function listAt(x, y) {
    if (!inZone(x, y)) return null;
    const mainEl = layerEl.querySelector('[data-hover-list="main"]');
    const sideEl = layerEl.querySelector('[data-hover-list="side"]');
    if (sideEl && (!mainEl || y >= sideEl.getBoundingClientRect().top - SPLIT_GAP / 2)) {
      return { list: 'side', el: sideEl, count: companion?.options?.length ?? 0 };
    }
    return mainEl ? { list: 'main', el: mainEl, count: options.length } : null;
  }

  function hitTest(x, y) {
    const at = listAt(x, y);
    if (!at) return null;
    const r = at.el.getBoundingClientRect();
    if (y < r.top || y >= r.bottom) return null;
    const index = Math.floor((y - r.top + at.el.scrollTop) / ROW_HEIGHT);
    return index >= 0 && index < at.count ? { list: at.list, index } : null;
  }

  const onScrollbar = (e) => !!e.target?.closest?.('.track');
  const onMenu = (e) => !!e.target?.closest?.('[role="menu"]');

  function updateHover() {
    const h = lastPointer ? hitTest(lastPointer.x, lastPointer.y) : null;
    hoverMain = h?.list === 'main' ? h.index : -1;
    hoverSide = h?.list === 'side' ? h.index : -1;
  }

  const inRange = (e) => !onScrollbar(e) && !onMenu(e) && inZone(e.clientX, e.clientY);

  const LIST_GAP = 6;
  const SPLIT_GAP = 9;
  let mainList = $state();
  let sideList = $state();
  let listMinWidth = $state(0);
  let lineLeft = $state(0);
  let lineWidth = $state(0);

  const halfRows = $derived(Math.max(2, Math.floor((availHeight - SPLIT_GAP) / 2 / ROW_HEIGHT)));
  const mainMaxHeight = $derived(companion ? Math.min(Math.max(1, options.length), halfRows) * ROW_HEIGHT : undefined);
  const sideMaxHeight = $derived.by(() => {
    const used = options.length > 0 ? (mainMaxHeight ?? 0) + SPLIT_GAP : 0;
    return Math.max(2, Math.floor((availHeight - used) / ROW_HEIGHT)) * ROW_HEIGHT;
  });

  $effect(() => {
    if (!open) return;
    const sidebar = rootEl.closest('#sidebar');
    const anchor = sidebar ? [...sidebar.children].find((el) => el.contains(rootEl)) : undefined;
    if (sidebar) {
      sidebar.classList.add('select-open');
      sidebar.dataset.selectOwner = listId;
      for (const el of sidebar.querySelectorAll(':scope > .select-anchor')) el.classList.remove('select-anchor');
    }
    anchor?.classList.add('select-anchor');
    return () => {
      if (!sidebar || sidebar.dataset.selectOwner !== listId) return;
      delete sidebar.dataset.selectOwner;
      sidebar.classList.remove('select-open');
      anchor?.classList.remove('select-anchor');
    };
  });

  function openList() {
    if (!canOpen) return;
    keyList = 'main';
    const rect = rootEl.getBoundingClientRect();
    const sidebar = rootEl.closest('#sidebar');
    const cs = getComputedStyle(currentEl);
    const textLeft = rect.left + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft);
    layerLeft = Math.max(0, textLeft - TEXT_INSET);
    const right = sidebar ? Math.max(rect.right, sidebar.getBoundingClientRect().right) : rect.right;
    listMinWidth = right - layerLeft;
    const sidebarRect = sidebar?.getBoundingClientRect();
    lineLeft = sidebarRect ? sidebarRect.left - layerLeft : 0;
    lineWidth = sidebarRect ? sidebarRect.width : listMinWidth;
    const top = rect.bottom + LIST_GAP;
    availHeight = window.innerHeight - top;
    layerStyle = `top: ${top}px; left: ${layerLeft}px;`;
    lastPointer = null;
    hoverMain = hoverSide = -1;
    open = true;
  }

  function choose(option) {
    if (String(option.value) !== String(value)) onchange?.(option.value);
  }

  function chooseCompanion(option) {
    if (String(option.value) !== String(companion?.value)) companion?.onchange?.(option.value);
  }

  function keepFocus() {
    currentEl?.focus({ preventScroll: true });
  }

  let dismissed = false;

  function handleMouseEnter() {
    dismissed = false;
    stopWaitingOutside();
    if (disabled || options.length === 0) return;
    if (!open) openList();
    keepFocus();
  }

  function handleMouseMove(e) {
    if (open || dismissed || e.buttons) return;
    handleMouseEnter();
  }

  function handleMouseLeave() {
    dismissed = false;
  }

  function isInsidePoint(x, y) {
    if (!rootEl) return false;
    const root = rootEl.getBoundingClientRect();
    if (x >= root.left && x < root.right && y >= root.top && y < root.bottom + 1) return true;
    return inZone(x, y);
  }

  let waitingOutside = false;

  function stopWaitingOutside() {
    waitingOutside = false;
  }

  $effect(() => {
    if (!open) return;
    const onMove = (e) => {
      lastPointer = e.buttons || onScrollbar(e) || onMenu(e) ? null : { x: e.clientX, y: e.clientY };
      updateHover();
      if (e.buttons) return;
      if (isInsidePoint(e.clientX, e.clientY)) {
        waitingOutside = false;
        return;
      }
      if (waitingOutside) return;
      if (e.target?.closest?.('[role="menu"]')) {
        waitingOutside = true;
        return;
      }
      close();
    };
    const onPress = (e) => {
      if (inRange(e)) {
        e.stopPropagation();
        return;
      }
      if (!waitingOutside || isInsidePoint(e.clientX, e.clientY) || e.target?.closest?.('[role="menu"]')) return;
      close();
    };
    const onWheel = (e) => {
      if (onMenu(e) || !inZone(e.clientX, e.clientY)) return;
      e.preventDefault();
      e.stopPropagation();
      const at = listAt(e.clientX, e.clientY);
      (at?.list === 'side' ? sideList : at?.list === 'main' ? mainList : null)?.wheel(e);
    };
    const onDown = (e) => {
      if (!inRange(e)) return;
      e.preventDefault();
      e.stopPropagation();
      keepFocus();
    };
    const onClick = (e) => {
      if (!inRange(e)) return;
      e.stopPropagation();
      const h = hitTest(e.clientX, e.clientY);
      if (h) keyList = h.list;
      if (h?.list === 'main') choose(options[h.index]);
      else if (h?.list === 'side') chooseCompanion(companion.options[h.index]);
    };
    window.addEventListener('mousedown', onDown, true);
    window.addEventListener('click', onClick, true);
    window.addEventListener('mousemove', onMove, true);
    window.addEventListener('pointerdown', onPress, true);
    window.addEventListener('wheel', onWheel, { capture: true, passive: false });
    return () => {
      window.removeEventListener('mousedown', onDown, true);
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('mousemove', onMove, true);
      window.removeEventListener('pointerdown', onPress, true);
      window.removeEventListener('wheel', onWheel, { capture: true });
    };
  });

  function close() {
    waitingOutside = false;
    open = false;
    if (document.activeElement === currentEl) currentEl.blur();
  }

  function handleKeydown(e) {
    if (disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      const side = open && hasCompanion && (keyList === 'side' || options.length === 0);
      const list = side ? companion.options : options;
      if (list.length === 0) return;
      const current = side ? list.findIndex((o) => String(o.value) === String(companion.value)) : selectedIndex;
      const next = Math.min(list.length - 1, Math.max(0, current + step));
      if (next === current) return;
      if (side) {
        chooseCompanion(list[next]);
        sideList?.centerIndex(next);
      } else {
        choose(list[next]);
        mainList?.centerIndex(next);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open) {
        dismissed = true;
        open = false;
      } else openList();
    } else if (e.key === 'Escape') {
      stopWaitingOutside();
      dismissed = true;
      open = false;
    }
  }
</script>

{#snippet icon(path)}
  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d={path} /></svg>
{/snippet}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="hover-select {className}" class:disabled class:open bind:this={rootEl}
  onmouseenter={handleMouseEnter} onmousemove={handleMouseMove} onmouseleave={handleMouseLeave}
>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div {id} class="current" bind:this={currentEl} role="combobox" aria-expanded={open} aria-controls={listId} aria-disabled={disabled}
    tabindex={disabled ? -1 : 0} onkeydown={handleKeydown}
  >{#if currentIcon}{@render icon(currentIcon)}{/if}{currentLabel}</div>
</div>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
  <div class="hover-select-layer" style={layerStyle} bind:this={layerEl} use:portal data-no-transform
    onscrollcapture={updateHover}
  >
    {#if options.length > 0}
      <HoverList bind:this={mainList} id={listId} {options} {value} role="main" hoverIndex={hoverMain}
        maxHeight={mainMaxHeight} minWidth={listMinWidth} />
    {/if}
    {#if hasCompanion}
      <div class="companion" class:split={options.length > 0} style:--split-gap="{SPLIT_GAP}px"
        style:--line-left="{lineLeft}px" style:--line-width="{lineWidth}px">
        <HoverList bind:this={sideList} options={companion.options} value={companion.value} role="side" hoverIndex={hoverSide}
          maxHeight={sideMaxHeight} minWidth={listMinWidth} />
      </div>
    {/if}
  </div>
{/if}

<style>
  .hover-select {
    position: relative;
    width: 100%;
    min-width: 0;
  }

  .current {
    box-sizing: border-box;
    border-radius: 6px;
    width: 100%;
    min-height: calc(1.2em + 10px);
    padding: 4px 24px 4px 8px;
    border: var(--border-color);
    background-color: var(--sidebar-color);
    color: var(--text-color);
    text-shadow: var(--text-shadow);
    background-image: url('data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white"><path d="M4.5 6L8 10l3.5-4h-7z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 6px center;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;
    outline: none;
    user-select: none;
  }

  .current:focus-visible {
    border-color: #aaa;
  }

  .hover-select.disabled .current {
    opacity: 0.5;
    cursor: not-allowed;
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

  .hover-select-layer {
    position: fixed;
    z-index: 150;
    font-size: var(--ui-font-size);
  }

  .companion.split {
    position: relative;
    margin-top: var(--split-gap);
  }

  .companion.split::before {
    content: '';
    position: absolute;
    top: calc(var(--split-gap) / -2);
    left: var(--line-left);
    width: var(--line-width);
    height: 1px;
    background: rgba(255, 255, 255, 0.35);
    box-shadow: 0 0 2px #000;
  }

  :global(#sidebar.select-open > .select-anchor ~ *) {
    visibility: hidden;
  }
</style>
