<script>
  import { exportQueue } from '$lib/exportQueue.svelte.js';
  import { t } from '$lib/i18n.svelte.js';
  import { openExportDirectory } from '$lib/fileManager.js';

  function handleCancel(id) {
    const item = exportQueue.items.find(i => i.id === id);
    if (!item) return;
    if (item.status === 'processing' && item.worker) {
      item.worker.postMessage({ type: 'CANCEL', id });
      item.worker.terminate();
    }
    exportQueue.updateStatus(id, 'cancelled');
  }

  function handleRemove(id) {
    handleCancel(id);
    exportQueue.remove(id);
  }
</script>

{#if exportQueue.items.length > 0}
  <div class="export-queue" role="region" aria-label="Export Queue">
    {#each exportQueue.items as item (item.id)}
      <div class="queue-item status-{item.status}">
        <div class="queue-header">
          <span class="queue-title">{item.name} ({item.type})</span>
          <button class="queue-close" onclick={() => handleRemove(item.id)} aria-label="Remove/Cancel">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {#if item.status === 'processing'}
          {@const displayProgress = Math.min(100, Math.max(0, Math.round(item.progress)))}
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: {displayProgress}%;"></div>
          </div>
          <div class="status-text">{displayProgress}%</div>
        {:else if item.status === 'completed'}
          <div class="status-row">
            <div class="status-text success">{t('completed') || 'Completed'}</div>
            <button class="queue-action" onclick={() => openExportDirectory()} title="Open folder">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        {:else if item.status === 'error'}
          <div class="status-text error">{t('error') || 'Error'}</div>
        {:else if item.status === 'cancelled'}
          <div class="status-text cancelled">{t('cancelled') || 'Cancelled'}</div>
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  .export-queue {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 4000;
  }

  .queue-item {
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(153, 153, 153, 0.5);
    border-radius: 10px;
    padding: 12px 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: var(--text-color, #ffffff);
    text-shadow: var(--text-shadow);
    transition: all 0.2s ease;
  }

  .status-completed {
    border-left: 3px solid #2ecc71;
  }
  .status-error {
    border-left: 3px solid #e74c3c;
  }
  .status-cancelled {
    border-left: 3px solid #95a5a6;
  }
  .status-processing {
    border-left: 3px solid #3498db;
  }

  .queue-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .queue-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color, #ffffff);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 240px;
  }

  .queue-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #999999;
    padding: 2px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }
  
  .queue-close:hover {
    color: #ffffff;
  }

  .progress-bar-container {
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
  }

  @media (prefers-color-scheme: dark) {
    .progress-bar-container {
      background: #334155;
    }
  }

  .progress-bar {
    height: 100%;
    background: #3498db;
  }

  .status-text {
    font-size: 13px;
    color: #cccccc;
  }

  .success { color: #ffffff; }
  .error { color: #e74c3c; }
  .cancelled { color: #95a5a6; }

  .status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -4px;
  }

  .queue-action {
    background: none;
    border: none;
    cursor: pointer;
    color: #2ecc71;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .queue-action:hover {
    background-color: rgba(46, 204, 113, 0.2);
    transform: scale(1.1);
  }
</style>
