<script>
  import { appState } from '$lib/appState.svelte.js';
  import { getRenderer } from '$lib/rendererStore.svelte.js';
  import { t } from '$lib/i18n.svelte.js';
  import { saveSetting } from '$lib/settings.js';

  let { onDirChange, onSceneChange, onAnimationChange, onExpressionChange } = $props();
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

  function handlePropertyMouseDown(e) {
    const cb = getCheckboxFromEvent(e);
    if (!cb) return;
    checkboxDragging = true;
    checkboxState = !cb.checked;    
    if (cb.checked !== checkboxState) {
      cb.checked = checkboxState;
      cb.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function handlePropertyMouseOver(e) {
    const cb = getCheckboxFromEvent(e);
    if (!checkboxDragging || !cb) return;
    if (cb.checked !== checkboxState) {
      cb.checked = checkboxState;
      cb.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function handlePropertyClick(e) {
    const cb = getCheckboxFromEvent(e);
    if (!cb) return;
    if (e.detail !== 0) e.preventDefault();
  }

  function handleGlobalMouseUp() {
    checkboxDragging = false;
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

  <select id="propertySelector" onchange={handlePropertyCategoryChange} value={appState.propertyCategory}>
    {#each propertyCategories as cat}
      <option value={cat}>{t(cat)}</option>
    {/each}
  </select>

  {#if propertyCategories.includes('attachments')}
    <select id="pmaSelect" onchange={handleAlphaModeChange} value={appState.alphaMode}>
      <option value="unpack">{t('alphaModeUnpack')}</option>
      <option value="pma">{t('alphaModePMA')}</option>
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
          <div class="item" style:display={matchesFilter(item.name) ? 'flex' : 'none'}>
            <label title={item.name}>
              {item.name}
              <input type="checkbox" data-name={item.name} data-old-index={item.index} checked={item.checked}>
            </label>
          </div>
        {/each}
      </div>
    {:else}
      {#each propertyItems as item (item.name + '_' + item.index)}
        <div class="item" style:display={matchesFilter(item.name) ? 'flex' : 'none'}>
          {#if item.type === 'range'}
            <label title={item.name}><span class="label-text">{item.name}</span><input type="range" data-name={item.name} data-old-index={item.index} max={item.max} min={item.min} step={item.step} value={item.value}></label>
          {:else}
            <label title={item.name}>
              {item.name}
              <input type="checkbox" data-name={item.name} data-old-index={item.index} checked={item.checked}>
            </label>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
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
    height: calc(100% - 181px);
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
</style>
