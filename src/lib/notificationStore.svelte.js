let notifications = $state([]);

export function getNotifications() {
  return notifications;
}

export function showNotification(message, type = 'error', duration = 3500) {
  const id = Date.now().toString() + Math.random().toString();
  notifications.push({ id, message, type });

  setTimeout(() => {
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.splice(index, 1);
    }
  }, duration);
}
