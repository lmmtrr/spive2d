<script>
  import { appState } from '$lib/appState.svelte.js';
  import { getRenderer } from '$lib/rendererStore.svelte.js';
  import { t } from '$lib/i18n.svelte.js';
  import { saveSetting } from '$lib/settings.js';

  let { onDirChange, onSceneChange, onAnimationChange, onExpressionChange, onSettingsClick } = $props();
  let filterText = $state('');
  let sidebarVisible = $state(false);
  let propertyItems = $state([]);
  let animations = $state([]);
  let expressions = $state(null);
  let propertyCategories = $state([]);
  let selectedAnimation = $state('');
  let selectedExpression = $state('');
  let propertyScrollEl;
  let checkboxDragging = false;
  let checkboxState = false;
  let rangeDragging = false;
  let rangeDragTarget = 'min';

  export function setSidebarVisible(visible) {
    sidebarVisible = visible;
  }

  export function refreshProperties() {
    const renderer = getRenderer();
    if (!renderer) return;
    animations = renderer.getAnimations() ?? [];
    expressions = renderer.getExpressions() ?? null;
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

  export function setSelectedAnimation(value) {
    selectedAnimation = value;
  }

  export function navigateAnimation(delta) {
    if (animations.length <= 1) return;
    const currentIndex = animations.findIndex(a => a.value === selectedAnimation);
    const newIndex = (currentIndex + delta + animations.length) % animations.length;
    selectedAnimation = animations[newIndex].value;
    onAnimationChange(selectedAnimation);
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

  function getRangeFromEvent(e, isMouseDown) {
    if (isMouseDown && e.target.tagName === 'INPUT' && e.target.type === 'range') return null;
    if (!e.target.classList.contains('label-text') && !e.target.closest('.label-text')) return null;
    const itemEl = e.target.closest('.item');
    if (!itemEl) return null;
    return itemEl.querySelector('input[type="range"]');
  }

  function handlePropertyMouseDown(e) {
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
    const rangeInput = getRangeFromEvent(e, true);
    if (rangeInput) {
      rangeDragging = true;
      const val = Number(rangeInput.value);
      const min = Number(rangeInput.min);
      const max = Number(rangeInput.max);
      const newValue = val !== min ? min : max;
      rangeDragTarget = val !== min ? 'min' : 'max';
      if (val !== newValue) {
        rangeInput.value = newValue;
        rangeInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
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
    if (rangeDragging) {
      const rangeInput = getRangeFromEvent(e, false);
      if (rangeInput) {
        const val = Number(rangeInput.value);
        const min = Number(rangeInput.min);
        const max = Number(rangeInput.max);
        const newValue = rangeDragTarget === 'min' ? min : max;
        if (val !== newValue) {
          rangeInput.value = newValue;
          rangeInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  }

  function handlePropertyClick(e) {
    const cb = getCheckboxFromEvent(e);
    if (cb) {
      if (e.detail !== 0) e.preventDefault();
      return;
    }
    const rangeInput = getRangeFromEvent(e, true);
    if (rangeInput) {
      e.preventDefault();
    }
  }

  function handleGlobalMouseUp() {
    checkboxDragging = false;
    rangeDragging = false;
  }

  $effect(() => {
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  });

  function matchesFilter(name) {
    if (!filterText) return true;
    return name.toLowerCase().includes(filterText.toLowerCase());
  }
</script>

<div id="sidebar" class:hidden={!sidebarVisible}>
  <select id="dirSelector" value={appState.directories.selectedDir} onchange={onDirChange}>
    {#each appState.directories.entries as dir}
      <option value={dir}>{dir.split('/').filter(Boolean).pop()}</option>
    {/each}
  </select>

  <select id="sceneSelector" value={appState.directories.files?.[appState.directories.selectedDir]?.[appState.directories.selectedScene]?.name || ''} onchange={onSceneChange}>
    {#if appState.directories.files && appState.directories.selectedDir}
      {#each appState.directories.files[appState.directories.selectedDir] || [] as scene}
        <option value={scene.name}>{scene.name.split('/').filter(Boolean).pop().replace(/^\u200B/, '')}</option>
      {/each}
    {/if}
  </select>

  <select id="animationSelector" value={selectedAnimation} onchange={(e) => {
    selectedAnimation = e.currentTarget.value;
    onAnimationChange(selectedAnimation);
  }}>
    {#each animations as anim (anim.value)}
      <option value={anim.value}>{anim.name}</option>
    {/each}
  </select>

  {#if expressions}
    <select id="expressionSelector" bind:value={selectedExpression} onchange={(e) => onExpressionChange(e.currentTarget.value)}>
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

  <input
    type="text"
    id="filterBox"
    placeholder={t('filter')}
    autocomplete="off"
    bind:value={filterText}
  />

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_mouse_events_have_key_events -->
  <div id="property" bind:this={propertyScrollEl}
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
        <div class="item" style:display={matchesFilter(item.displayName || item.name) ? 'flex' : 'none'}>
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
    background: var(--sidebar-color);
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  #sidebar.hidden {
    visibility: hidden;
  }

  #filterBox {
    text-indent: 6px;
    border-radius: 6px;
    height: 30px;
    width: 100%;
    outline: none;
    color: var(--text-color);
    border: var(--border-color);
    font-size: 15px;
    background-color: var(--sidebar-color);
  }

  #property {
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    color: var(--text-color);
    text-shadow: var(--text-shadow);
  }

  .item label {
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 4px 0;
    width: 100%;
  }

  .label-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
  }

  .item input[type="range"] {
    width: 80px;
    min-width: 80px;
    flex-shrink: 0;
    margin-left: 4px;
  }

  .item input[type="checkbox"] {
    order: -1;
    margin-right: 8px;
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
