import { openDB } from 'idb';

const DATABASE_NAME = 'story-app-db';
const DATABASE_VERSION = 1;
const STORE_STORIES = 'stories';
const STORE_SYNC = 'sync-stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_STORIES)) {
      db.createObjectStore(STORE_STORIES, { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains(STORE_SYNC)) {
      db.createObjectStore(STORE_SYNC, { keyPath: 'id', autoIncrement: true });
    }
  },
});

const IDBHelper = {
  async getStory(id) {
    const db = await dbPromise;
    return db.get(STORE_STORIES, id);
  },
  
  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORE_STORIES);
  },
  
  async putStory(story) {
    const db = await dbPromise;
    return db.put(STORE_STORIES, story);
  },
  
  async deleteStory(id) {
    const db = await dbPromise;
    return db.delete(STORE_STORIES, id);
  },
  
  async clearStories() {
    const db = await dbPromise;
    return db.clear(STORE_STORIES);
  },

  // For offline background sync
  async putSyncStory(storyData) {
    const db = await dbPromise;
    return db.put(STORE_SYNC, storyData);
  },
  
  async getAllSyncStories() {
    const db = await dbPromise;
    return db.getAll(STORE_SYNC);
  },
  
  async deleteSyncStory(id) {
    const db = await dbPromise;
    return db.delete(STORE_SYNC, id);
  }
};

export default IDBHelper;
