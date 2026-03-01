<script>
  import { getNotifications } from '$lib/notificationStore.svelte.js';
  import { fly } from 'svelte/transition';

  const notifications = getNotifications();
</script>

<div class="notification-container">
  {#each notifications as notification (notification.id)}
    <div 
      class="notification {notification.type}" 
      role="alert"
      in:fly={{ x: 40, duration: 300 }}
      out:fly={{ opacity: 0, duration: 300 }}
    >
      <span class="notification-icon">
        {#if notification.type === 'error'}⚠{:else if notification.type === 'success'}✓{:else}ℹ{/if}
      </span>
      <span class="notification-message">{notification.message}</span>
    </div>
  {/each}
</div>

<style>
  .notification-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
    z-index: 5000;
    pointer-events: none;
  }

  .notification {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    color: var(--text-color);
    text-shadow: var(--text-shadow);
    border: 1px solid rgba(153, 153, 153, 0.5);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    max-width: 420px;
    font-size: 14px;
    user-select: none;
    pointer-events: auto;
  }

  .notification.error {
    border-left: 3px solid #e74c3c;
  }

  .notification.success {
    border-left: 3px solid #2ecc71;
  }

  .notification.info {
    border-left: 3px solid #3498db;
  }

  .notification-icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  .notification.error .notification-icon {
    color: #e74c3c;
  }

  .notification.success .notification-icon {
    color: #2ecc71;
  }

  .notification.info .notification-icon {
    color: #3498db;
  }

  .notification-message {
    line-height: 1.4;
  }
</style>
