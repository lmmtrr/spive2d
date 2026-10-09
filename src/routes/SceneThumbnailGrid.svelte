<script>
  import { tick } from 'svelte';
  import { appState } from '#lib/appState.svelte.js';
  import { thumbnailManager } from '#lib/thumbnailManager.svelte.js';
  import { filterSceneIndices } from '#lib/utils.js';
  import { t } from '#lib/i18n.svelte.js';

  let { open = $bindable(false), onSelect } = $props();
  let dialogEl;
  let gridEl = $state();
  let dirName = $derived(appState.directories.selectedDir);
  let scenes = $derived(appState.directories.files?.[dirName] || []);
  let sceneIndices = $derived(filterSceneIndices(scenes, appState.directories.sceneFilter));

  $effect(() => {
    if (open && dialogEl && !dialogEl.open) {
      dialogEl.showModal();
      tick().then(() => {
        gridEl?.querySelector('.thumbnail-item.selected')?.scrollIntoView({ block: 'center' });
      });
    } else if (!open && dialogEl?.open) {
      dialogEl.close();
    }
  });

  function handleClose() {
    open = false;
    thumbnailManager.cancelAll();
  }

  function handleDialogClick(e) {
    if (e.target === dialogEl) handleClose();
  }

  function handleSelect(index) {
    handleClose();
    if (index !== appState.directories.selectedScene) onSelect(index);
  }

  function lazyThumbnail(node, scene) {
    const dir = dirName;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) thumbnailManager.request(dir, scene);
        else thumbnailManager.cancel(dir, scene);
      }
    }, { root: gridEl, rootMargin: '200px' });
    observer.observe(node);
    return {
      destroy() {
        observer.disconnect();
        thumbnailManager.cancel(dir, scene);
      }
    };
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialogEl} onclose={handleClose} closedby="any" onclick={handleDialogClick}>
  <div class="grid-header">
    <div class="filter-wrapper">
      <input
        type="text"
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
    <span class="scene-count">{sceneIndices.length} / {scenes.length}</span>
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="close-btn" onclick={handleClose}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>
  </div>

  <div class="thumbnail-grid" bind:this={gridEl}>
    {#if open}
      {#each sceneIndices as i (dirName + '::' + scenes[i].name)}
        {@const scene = scenes[i]}
        {@const name = scene.name.replace(/^​/, '')}
        {@const url = thumbnailManager.getThumbnail(dirName, scene)}
        <button
          class="thumbnail-item"
          class:selected={i === appState.directories.selectedScene}
          title={name}
          onclick={() => handleSelect(i)}
          use:lazyThumbnail={scene}
        >
          <div class="thumbnail-image">
            {#if url}
              <img src={url} alt={name} draggable="false" />
            {:else if !thumbnailManager.hasThumbnail(dirName, scene)}
              <div class="thumbnail-spinner"></div>
            {/if}
          </div>
          <span class="thumbnail-name">{name.split('/').filter(Boolean).pop()}</span>
        </button>
      {/each}
    {/if}
  </div>
</dialog>

<style>
  dialog {
    background: var(--sidebar-color);
    color: var(--text-color);
    text-shadow: var(--text-shadow);
    border: var(--border-color);
    border-radius: 10px;
    padding: 0;
    width: min(90vw, 1100px);
    height: min(85vh, 900px);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    user-select: none;
    overflow: hidden;
  }

  dialog[open] {
    display: flex;
    flex-direction: column;
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.4);
  }

  .grid-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-bottom: 1px solid #999;
  }

  .filter-wrapper {
    position: relative;
    flex: 1;
  }

  .filter-wrapper input {
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

  .filter-clear-btn,
  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: #ccc;
    cursor: pointer;
    outline: none;
    transition: background-color 0.2s, color 0.2s;
  }

  .filter-clear-btn {
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
  }

  .close-btn {
    width: 30px;
    height: 30px;
    min-width: 30px;
  }

  .filter-clear-btn:hover,
  .close-btn:hover {
    background-color: #555;
    color: #fff;
  }

  .filter-clear-btn svg {
    width: 14px;
    height: 14px;
  }

  .close-btn svg {
    width: 20px;
    height: 20px;
  }

  .scene-count {
    font-size: 13px;
    color: #ccc;
    white-space: nowrap;
  }

  .thumbnail-grid {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-auto-rows: max-content;
    gap: 10px;
    padding: 10px;
  }

  .thumbnail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    color: var(--text-color);
    text-shadow: var(--text-shadow);
    cursor: pointer;
    outline: none;
    min-width: 0;
    transition: background-color 0.15s, border-color 0.15s;
  }

  .thumbnail-item:hover {
    background-color: #fff1;
    border-color: #999;
  }

  .thumbnail-item.selected {
    background-color: #fff2;
    border-color: #fff;
  }

  .thumbnail-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 4px;
    background-color: #0004;
    overflow: hidden;
  }

  .thumbnail-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .thumbnail-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #eee;
    border-top: 3px solid #888;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .thumbnail-name {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
</style>
