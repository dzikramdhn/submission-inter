import { openDB } from 'idb';

const DB_NAME = 'storyapp-db';
const DB_VERSION = 1;
const STORE_STORIES = 'stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_STORIES)) {
      db.createObjectStore(STORE_STORIES, { keyPath: 'id' });
    }
  },
});

export async function saveStories(list) {
  const db = await dbPromise;
  const tx = db.transaction(STORE_STORIES, 'readwrite');
  list.forEach((item) => tx.store.put(item));
  await tx.done;
}

export async function getStories() {
  const db = await dbPromise;
  return db.getAll(STORE_STORIES);
}

export async function clearStories() {
  const db = await dbPromise;
  const tx = db.transaction(STORE_STORIES, 'readwrite');
  await tx.store.clear();
  await tx.done;
}
