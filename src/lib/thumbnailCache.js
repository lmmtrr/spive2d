const DB_NAME = 'spive2d-thumbnails';
const DB_VERSION = 1;
const STORE = 'thumbnails';
const LAST_USED_INDEX = 'lastUsed';
const MAX_ENTRIES = 5000;
const PRUNE_DELAY_MS = 2000;

let dbPromise = null;
let pruneTimer = null;

function openDb() {
  if (dbPromise) return dbPromise;
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  dbPromise = new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(STORE, { keyPath: 'key' });
      store.createIndex(LAST_USED_INDEX, 'lastUsed');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.warn('[ThumbnailCache] Failed to open IndexedDB:', request.error);
      resolve(null);
    };
  });
  return dbPromise;
}

async function withStore(mode, fn) {
  const db = await openDb();
  if (!db) return null;
  const tx = db.transaction(STORE, mode);
  const result = fn(tx.objectStore(STORE));
  await new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
  return result instanceof IDBRequest ? result.result : result;
}

function schedulePrune() {
  if (pruneTimer) return;
  pruneTimer = setTimeout(() => {
    pruneTimer = null;
    prune().catch(err => console.warn('[ThumbnailCache] Failed to prune:', err));
  }, PRUNE_DELAY_MS);
}

async function prune() {
  await withStore('readwrite', (store) => {
    const countRequest = store.count();
    countRequest.onsuccess = () => {
      let excess = countRequest.result - MAX_ENTRIES;
      if (excess <= 0) return;
      const cursorRequest = store.index(LAST_USED_INDEX).openCursor();
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (!cursor || excess <= 0) return;
        cursor.delete();
        excess--;
        cursor.continue();
      };
    };
  });
}

export const thumbnailCache = {
  async get(key) {
    try {
      const record = await withStore('readonly', store => store.get(key));
      if (!record) return null;
      withStore('readwrite', store => store.put({ ...record, lastUsed: Date.now() }))
        .catch(() => {});
      return record.blob;
    } catch (err) {
      console.warn('[ThumbnailCache] Failed to read:', err);
      return null;
    }
  },

  async put(key, blob) {
    try {
      await withStore('readwrite', store => store.put({ key, blob, lastUsed: Date.now() }));
      schedulePrune();
    } catch (err) {
      console.warn('[ThumbnailCache] Failed to write:', err);
    }
  },

  async clear() {
    await withStore('readwrite', store => store.clear());
  },
};
