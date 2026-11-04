<script>
  import { appState } from '#lib/appState.svelte.js';
  import { getRenderer } from '#lib/rendererStore.svelte.js';
  import { t } from '#lib/i18n.svelte.js';
  import { saveSetting } from '#lib/settings.js';
  import { filterSceneIndices, findIdleAnimation } from '#lib/utils.js';
  import { scrollAssist } from '#lib/scrollAssist.js';

  let { onSceneChange, onAnimationChange, onExpressionChange, onSettingsClick, onSceneGridClick } = $props();
  let filterText = $state('');
  let scenes = $derived(appState.directories.files?.[appState.directories.selectedDir] || []);
  let sceneOptionIndices = $derived.by(() => {
    const indices = filterSceneIndices(scenes, appState.directories.sceneFilter);
    const selected = appState.directories.selectedScene;
    if (selected >= scenes.length || indices.includes(selected)) return indices;
    return [...indices, selected].sort((a, b) => a - b);
  });
  let sidebarVisible = $state(false);
  let propertyItems = $state([]);
  let animations = $state([]);
  let expressions = $state(null);
  let propertyCategories = $state([]);
  let selectedAnimation = $state('');
  let lastSelectedAnimation = $state('');
  let selectedExpression = $state('');
  let propertyScrollEl;
  let checkboxDragging = false;
  let checkboxState = false;
  let resetDragging = false;
  let sliderDrag = null;
  const SLIDER_THUMB_WIDTH = 12;
  const SLIDER_EDGE_SNAP = 8;

  export function setSidebarVisible(visible) {
    sidebarVisible = visible;
  }

  export function refreshProperties() {
    const renderer = getRenderer();
    if (!renderer) return;
    animations = renderer.getAnimations() ?? [];
    const isValid = animations.some(a => a.value === lastSelectedAnimation);
    if (!isValid && animations.length > 0) {
      const idleMatch = findIdleAnimation(animations);
      lastSelectedAnimation = idleMatch ? idleMatch.value : animations[0].value;
    }
    expressions = renderer.getExpressions() ?? null;
    if (renderer.currentFaceKey !== undefined) {
      selectedExpression = renderer.currentFaceKey || '';
    } else if (!expressions || !expressions.some(e => e.value === selectedExpression)) {
      selectedExpression = '';
    }
    propertyCategories = renderer.getPropertyCategories() ?? [];
    if (!propertyCategories.includes(appState.propertyCategory)) {
      appState.propertyCategory = propertyCategories[0] || 'attachments';
    }
    propertyItems = renderer.getPropertyItems(appState.propertyCategory);
  }

  export function getSelectedAnimation() {
    return selectedAnimation;
  }

  export function getSelectedAnimationText() {
    const anim = animations.find(a => a.value === selectedAnimation);
    return anim ? anim.name : selectedAnimation;
  }

  export function getSelectedExpression() {
    return selectedExpression;
  }

  export function getSelectedExpressionText() {
    if (!expressions) return '';
    const expr = expressions.find(e => e.value === selectedExpression);
    return expr ? expr.name : (expressions.length > 0 ? selectedExpression : '');
  }

  export function setSelectedExpression(value) {
    selectedExpression = value;
  }

  export function setSelectedAnimation(value) {
    selectedAnimation = value;
    if (value !== '') {
      lastSelectedAnimation = value;
    }
  }

  export function navigateAnimation(delta) {
    if (animations && animations.length > 1) {
      const baseAnimation = selectedAnimation !== '' ? selectedAnimation : lastSelectedAnimation;
      let currentIndex = animations.findIndex(a => a.value === baseAnimation);
      if (currentIndex === -1) {
        currentIndex = 0;
      }
      const newIndex = (currentIndex + delta + animations.length) % animations.length;
      selectedAnimation = animations[newIndex].value;
      if (selectedAnimation !== '') {
        lastSelectedAnimation = selectedAnimation;
      }
      onAnimationChange(selectedAnimation);
    } else if (expressions && expressions.length > 1) {
      const currentIndex = expressions.findIndex(e => e.value === selectedExpression);
      const newIndex = (currentIndex + delta + expressions.length) % expressions.length;
      selectedExpression = expressions[newIndex].value;
      onExpressionChange(selectedExpression);
    }
  }

  function handlePropertyCategoryChange(e) {
    appState.propertyCategory = e.target.value;
    refreshProperties();
    if (propertyScrollEl) propertyScrollEl.scrollTop = 0;
  }

  function handleResetOverrides() {
    const renderer = getRenderer();
    if (!renderer) return;
    renderer.resetOverrides(appState.propertyCategory);
    refreshProperties();
  }

  function handleResetAnimation() {
    if (selectedAnimation !== '') {
      lastSelectedAnimation = selectedAnimation;
      selectedAnimation = '';
      onAnimationChange('');
    } else {
      const fallbackAnim = lastSelectedAnimation || (animations[0]?.value || '');
      selectedAnimation = fallbackAnim;
      onAnimationChange(fallbackAnim);
    }
  }

  async function handleAlphaModeChange(e) {
    appState.alphaMode = e.target.value;
    saveSetting('spive2d_alpha_mode', appState.alphaMode);
    const renderer = getRenderer();
    if (renderer && renderer.setAlphaMode) {
      await renderer.setAlphaMode(appState.alphaMode);
      refreshProperties();
      if (animations.length > 0) {
        if (!animations.some(a => a.value === selectedAnimation)) {
          selectedAnimation = animations[0].value;
        }
        onAnimationChange(selectedAnimation);
      }
    }
  }

  function handlePropertyInput(e) {
    const target = e.target;
    const name = target.dataset.name;
    const index = Number(target.dataset.oldIndex);
    const renderer = getRenderer();
    if (target.type === 'range') {
      renderer?.updatePropertyItem(appState.propertyCategory, name, index, Number(target.value));
      if (appState.animation.paused) {
        renderer?.render();
      }
      const item = propertyItems.find(i => i.index === index);
      if(item) {
        item.value = Number(target.value);
        item.overridden = true;
      }
    } else if (target.type === 'checkbox') {
      if (appState.propertyCategory === 'skins') {
        const item = propertyItems.find(i => i.index === index);
        if(item) {
           item.checked = target.checked;
        }
        handleSkinChange();
      } else {
        renderer?.updatePropertyItem(appState.propertyCategory, name, index, target.checked);
        const item = propertyItems.find(i => i.index === index);
        if(item) {
           item.checked = target.checked;
        }
      }
      if (appState.animation.paused) {
        renderer?.render();
      }
    }
  }

  function handleSkinChange() {
    const names = propertyItems.filter(item => item.checked).map(item => item.name);
    const renderer = getRenderer();
    renderer?.applySkins?.(names);
  }

  function getCheckboxFromEvent(e) {
    if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') return e.target;
    return e.target.closest?.('.item')?.querySelector('input[type="checkbox"]');
  }

  function getRangeFromLabel(e) {
    if (!e.target.closest?.('.label-text')) return null;
    return e.target.closest('.item')?.querySelector('input[type="range"]') ?? null;
  }

  function resetRange(rangeInput) {
    const renderer = getRenderer();
    if (typeof renderer?.resetPropertyItem !== 'function') return;
    const index = Number(rangeInput.dataset.oldIndex);
    const value = renderer.resetPropertyItem(appState.propertyCategory, rangeInput.dataset.name, index);
    if (!Number.isFinite(value)) return;
    rangeInput.value = String(value);
    const item = propertyItems.find(i => i.index === index);
    if (item) {
      item.value = value;
      item.overridden = false;
    }
  }

  function getVisibleRows() {
    if (!propertyScrollEl) return [];
    return Array.from(propertyScrollEl.querySelectorAll('.item')).filter(el => el.style.display !== 'none');
  }

  function getRowIndexAt(rows, clientY) {
    for (let i = 0; i < rows.length; i++) {
      const rect = rows[i].getBoundingClientRect();
      if (clientY >= rect.top && clientY < rect.bottom) return i;
    }
    return -1;
  }

  function setRangeFromPointer(rangeInput, clientX) {
    if (!rangeInput) return;
    const rect = rangeInput.getBoundingClientRect();
    const inset = SLIDER_THUMB_WIDTH / 2 + SLIDER_EDGE_SNAP;
    const span = rect.width - inset * 2;
    const ratio = span > 0 ? Math.min(1, Math.max(0, (clientX - rect.left - inset) / span)) : 0;
    const min = Number(rangeInput.min);
    const max = Number(rangeInput.max);
    const previous = rangeInput.value;
    rangeInput.value = String(min + (max - min) * ratio);
    if (rangeInput.value !== previous) {
      rangeInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function getRowRange(row) {
    return row?.querySelector('input[type="range"]') ?? null;
  }

  function handlePropertyMouseDown(e) {
    if (e.button !== 0) return;
    if (e.target.tagName === 'INPUT' && e.target.type === 'range') {
      e.preventDefault();
      e.target.focus({ preventScroll: true });
      const rows = getVisibleRows();
      sliderDrag = { rows, last: rows.indexOf(e.target.closest('.item')) };
      setRangeFromPointer(e.target, e.clientX);
      return;
    }
    const cb = getCheckboxFromEvent(e);
    if (cb) {
      checkboxDragging = true;
      checkboxState = !cb.checked;
      if (cb.checked !== checkboxState) {
        cb.checked = checkboxState;
        cb.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }
    const rangeInput = getRangeFromLabel(e);
    if (rangeInput) {
      e.preventDefault();
      resetDragging = true;
      resetRange(rangeInput);
    }
  }

  function handlePropertyMouseOver(e) {
    if (checkboxDragging) {
      const cb = getCheckboxFromEvent(e);
      if (cb && cb.checked !== checkboxState) {
        cb.checked = checkboxState;
        cb.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }
    if (resetDragging) {
      const rangeInput = getRangeFromLabel(e);
      if (rangeInput) resetRange(rangeInput);
    }
  }

  function handlePropertyClick(e) {
    const cb = getCheckboxFromEvent(e);
    if (cb) {
      if (e.detail !== 0) e.preventDefault();
      return;
    }
    if (getRangeFromLabel(e)) {
      e.preventDefault();
    }
  }

  function handleGlobalMouseMove(e) {
    if (!sliderDrag) return;
    const { rows } = sliderDrag;
    const current = getRowIndexAt(rows, e.clientY);
    if (current === -1 || sliderDrag.last === -1 || current === sliderDrag.last) {
      const index = current === -1 ? sliderDrag.last : current;
      setRangeFromPointer(getRowRange(rows[index]), e.clientX);
      if (current !== -1) sliderDrag.last = current;
      return;
    }
    const step = current > sliderDrag.last ? 1 : -1;
    for (let i = sliderDrag.last + step; ; i += step) {
      setRangeFromPointer(getRowRange(rows[i]), e.clientX);
      if (i === current) break;
    }
    sliderDrag.last = current;
  }

  function handleGlobalMouseUp() {
    checkboxDragging = false;
    resetDragging = false;
    sliderDrag = null;
  }

  $effect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  });

  function matchesFilter(name) {
    if (!filterText) return true;
    return name.toLowerCase().includes(filterText.toLowerCase());
  }
</script>

<div id="sidebar" class:hidden={!sidebarVisible}>
  <div class="filter-wrapper">
    <input
      type="text"
      id="sceneFilterBox"
      placeholder={t('filter')}
      autocomplete="off"
      bind:value={appState.directories.sceneFilter}
    />
    {#if appState.directories.sceneFilter}
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="filter-clear-btn" onclick={() => appState.directories.sceneFilter = ''}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    {/if}
  </div>

  <div class="scene-header">
    <select id="sceneSelector" value={String(appState.directories.selectedScene)} onchange={onSceneChange}>
      {#each sceneOptionIndices as i (i)}
        <option value={String(i)}>{scenes[i].name.replace(/^\u200B/, '')}</option>
      {/each}
    </select>
    <button id="sceneGridBtn" onclick={onSceneGridClick} title={t('sceneThumbnails')} disabled={scenes.length === 0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/>
      </svg>
    </button>
  </div>

  <div class="animation-header">
    <select id="animationSelector" 
            value={selectedAnimation === '' ? lastSelectedAnimation : selectedAnimation} 
            disabled={selectedAnimation === ''}
            onchange={(e) => {
              selectedAnimation = e.currentTarget.value;
              if (selectedAnimation !== '') {
                lastSelectedAnimation = selectedAnimation;
              }
              onAnimationChange(selectedAnimation);
            }}>
      {#each animations as anim (anim.value)}
        <option value={anim.value}>{anim.name}</option>
      {/each}
    </select>
    <button id="resetAnimationBtn" class:active={selectedAnimation === ''} onclick={handleResetAnimation} title={t('resetAnimation')}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 11H7v-2h10v2z"/>
      </svg>
    </button>
  </div>

  {#if expressions}
    <select id="expressionSelector" value={selectedExpression} onchange={(e) => {
      selectedExpression = e.currentTarget.value;
      onExpressionChange(selectedExpression);
    }}>
      {#each expressions as expr}
        <option value={expr.value}>{expr.name}</option>
      {/each}
    </select>
  {/if}

  <div class="property-header">
    <select id="propertySelector" onchange={handlePropertyCategoryChange} value={appState.propertyCategory}>
      {#each propertyCategories as cat}
        <option value={cat}>{t(cat)}</option>
      {/each}
    </select>
    {#if propertyCategories.length > 0 && appState.propertyCategory !== 'skins'}
      <button id="resetOverridesBtn" onclick={handleResetOverrides} title={t('resetState')}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
    {/if}
  </div>

  {#if propertyCategories.includes('attachments')}
    <select id="pmaSelect" onchange={handleAlphaModeChange} value={appState.alphaMode}>
      <option value="pma">{t('alphaModePMA')}</option>
      <option value="unpack">{t('alphaModeUnpack')}</option>
      <option value="npm">{t('alphaModeNPM')}</option>
    </select>
  {/if}

  <div class="filter-wrapper">
    <input
      type="text"
      id="filterBox"
      placeholder={t('filter')}
      autocomplete="off"
      bind:value={filterText}
    />
    {#if filterText}
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="filter-clear-btn" onclick={() => filterText = ''}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    {/if}
  </div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_mouse_events_have_key_events -->
  <div id="property" bind:this={propertyScrollEl} use:scrollAssist
    oninput={handlePropertyInput}
    onmousedown={handlePropertyMouseDown}
    onmouseover={handlePropertyMouseOver}
    onclick={handlePropertyClick}
  >
    {#if appState.propertyCategory === 'skins'}
      <div id="skin-panel">
        {#each propertyItems as item (item.name + '_' + item.index)}
          <div class="item" style:display={matchesFilter(item.displayName || item.name) ? 'flex' : 'none'}>
            <label title={item.displayName || item.name}>
              {item.displayName || item.name}
              <input type="checkbox" data-name={item.name} data-old-index={item.index} checked={item.checked}>
            </label>
          </div>
        {/each}
      </div>
    {:else}
      {#each propertyItems as item (item.name + '_' + item.index)}
        <div class="item" class:overridden={item.overridden} style:display={matchesFilter(item.displayName || item.name) ? 'flex' : 'none'}>
          {#if item.type === 'range'}
            <label title={item.displayName || item.name}><span class="label-text">{item.displayName || item.name}</span><input type="range" data-name={item.name} data-old-index={item.index} max={item.max} min={item.min} step={item.step} value={item.value}></label>
          {:else}
            <label title={item.displayName || item.name}>
              {item.displayName || item.name}
              <input type="checkbox" data-name={item.name} data-old-index={item.index} checked={item.checked}>
            </label>
          {/if}
        </div>
      {/each}
    {/if}
  </div>

  <button id="settingsBtn" onclick={onSettingsClick} title={t('settings')}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25c-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03c-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25c.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l-.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03c.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-7.43 2.52c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z"/>
    </svg>
    <span>{t('settings')}</span>
  </button>
</div>

<style>
  #sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: var(--sidebar-width);
    padding: 10px;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  #sidebar::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    background: var(--sidebar-color);
    z-index: -1;
  }

  #sidebar.hidden {
    visibility: hidden;
  }

  #filterBox,
  #sceneFilterBox {
    text-indent: 6px;
    border-radius: 6px;
    height: 30px;
    width: 100%;
    outline: none;
    color: var(--text-color);
    border: var(--border-color);
    font-size: 15px;
    background-color: var(--sidebar-color);
    box-sizing: border-box;
    padding-right: 30px;
  }

  .filter-wrapper {
    position: relative;
  }

  .scene-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .scene-header select {
    flex-grow: 1;
    min-width: 0;
  }

  .filter-wrapper:has(#sceneFilterBox) + .scene-header select,
  .filter-wrapper:has(#sceneFilterBox) + .scene-header button {
    border-top: 0;
  }

  .filter-clear-btn {
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: #ccc;
    cursor: pointer;
    outline: none;
    transition: background-color 0.2s, color 0.2s;
  }

  .filter-clear-btn:hover {
    background-color: #555;
    color: #fff;
  }

  .filter-clear-btn svg {
    width: 14px;
    height: 14px;
  }

  #property {
    overflow-x: hidden;
    overflow-y: auto;
    padding-left: 18px;
    flex: 1;
    min-height: 0;
    width: max-content;
    min-width: 100%;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    color: var(--text-color);
    text-shadow: var(--text-shadow);
  }

  .item.overridden {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  .item label {
    display: flex;
    align-items: center;
    padding: 4px 0;
    width: 100%;
    white-space: nowrap;
  }

  .label-text {
    white-space: nowrap;
    flex: 1;
  }

  .item input[type="range"] {
    width: 80px;
    min-width: 80px;
    flex-shrink: 0;
    order: -1;
    align-self: stretch;
    height: auto;
    margin: -4px 0;
    padding: 0;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
  }

  .item input[type="range"]::-webkit-slider-runnable-track {
    box-sizing: border-box;
    height: 8px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid #666;
    border-radius: 4px;
  }

  .item input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    margin-top: -3px;
    background: #bbb;
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  }

  .item label:has(input[type="range"]) .label-text {
    padding-left: 8px;
  }

  .item input[type="checkbox"] {
    order: -1;
    margin-right: 8px;
    accent-color: #222;
  }

  #settingsBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
    padding: 8px 16px;
    background-color: var(--sidebar-color);
    border: var(--border-color);
    border-radius: 6px;
    color: #ccc;
    text-shadow: var(--text-shadow);
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s, border-color 0.2s;
    outline: none;
    width: 100%;
  }

  #settingsBtn:hover {
    background-color: #555;
  }

  #settingsBtn svg {
    width: 18px;
    height: 18px;
  }

  .property-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .property-header select {
    flex-grow: 1;
    border-top: 0 !important;
  }

  .animation-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .animation-header select {
    flex-grow: 1;
    border-top: 0 !important;
  }

  .animation-header select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  #sceneGridBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--sidebar-color);
    border: var(--border-color);
    border-radius: 6px;
    color: #ccc;
    cursor: pointer;
    width: 32px;
    height: 28px;
    min-width: 32px;
    transition: background-color 0.2s, color 0.2s;
    outline: none;
  }

  #sceneGridBtn:hover:not(:disabled) {
    background-color: #555;
    color: #fff;
  }

  #sceneGridBtn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  #sceneGridBtn svg {
    width: 16px;
    height: 16px;
  }

  #resetAnimationBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--sidebar-color);
    border: var(--border-color);
    border-top: 0 !important;
    border-radius: 6px;
    color: #ccc;
    cursor: pointer;
    width: 32px;
    height: 28px;
    min-width: 32px;
    transition: background-color 0.2s, color 0.2s;
    outline: none;
  }

  #resetAnimationBtn:hover {
    background-color: #555;
    color: #fff;
  }

  #resetAnimationBtn.active {
    background-color: #555;
    color: #fff;
    border-color: #aaa;
  }

  #resetAnimationBtn svg {
    width: 16px;
    height: 16px;
  }

  #resetOverridesBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--sidebar-color);
    border: var(--border-color);
    border-radius: 6px;
    color: #ccc;
    cursor: pointer;
    width: 32px;
    height: 28px;
    min-width: 32px;
    transition: background-color 0.2s, color 0.2s;
    outline: none;
  }

  #resetOverridesBtn:hover {
    background-color: #555;
    color: #fff;
  }

  #resetOverridesBtn svg {
    width: 16px;
    height: 16px;
  }
</style>
