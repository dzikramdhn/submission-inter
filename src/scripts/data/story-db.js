import { openDB } from 'idb';

const DB_NAME = 'storyapp-db';
const DB_VERSION = 1;
const STORE = 'saved-stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
  },
});

const StoryDB = {
  getAll: async () => (await dbPromise).getAll(STORE),
  get: async (id) => (await dbPromise).get(STORE, id),
  put: async (story) => (await dbPromise).put(STORE, story),
  delete: async (id) => (await dbPromise).delete(STORE, id),
};

export default StoryDB;
