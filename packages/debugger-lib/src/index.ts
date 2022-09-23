import { StorageManager } from '@hengshuai/helper';

// StorageManager.local.clear().set('active', 1);
// StorageManager.local;

const request = indexedDB.open('demo', 1);
let db;
request.onupgradeneeded = () => {
  db = request.result;
  const store = db.createObjectStore('books', { keyPath: 'isbn' });
  const titleIndex = store.createIndex('by_title', 'title', { unique: true });
  const authorIndex = store.createIndex('by_author', 'author');

  // Populate with initial data.
  store.put({ title: 'xxxx', author: 'Fred', isbn: 123456 });
  // store.put({ title: 'xxxx', author: 'Fred', isbn: 234567 });
  store.put({ title: 'Bedrock Nights', author: 'Barney', isbn: 345678 });

  // const tx = db.transaction('user', 'readwrite');
  // tx.objectStore('user').put({ uuid: 1 });
};
request.onsuccess = function () {
  db = request.result; // db.version will be 3.
};

request.onerror = (e: Event) => {
  console.log(e);
};
