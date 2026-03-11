export const exportQueue = $state({
  items: [],
  get isProcessing() {
    return this.items.some(i => i.status === 'processing');
  },
  add(item) {
    this.items.push(item);
  },
  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
  },
  updateProgress(id, progress) {
    const item = this.items.find(i => i.id === id);
    if (item) item.progress = progress;
  },
  updateStatus(id, status) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.status = status;
      if (status === 'completed') {
        setTimeout(() => {
          this.remove(id);
        }, 3000);
      }
    }
  },
});
