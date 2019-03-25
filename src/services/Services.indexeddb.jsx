class ServicesIndexedDB {

    static createDatabase = () => {
        return new Promise((resolve, reject) => {

            const dbRequest = indexedDB.open('news', 1);
            dbRequest.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('news')) {
                    const tweetListStore = db.createObjectStore('news', {autoIncrement: true});
                    tweetListStore.createIndex('slug', 'slug', {unique: false});
                }
            };
            dbRequest.onsuccess = (event) => {
                if (event.type === 'success') {
                    const db = event.target.result;
                    resolve(db);
                }
            }
        });
    };


    static getRecordount = (db) => {
        return new Promise((resolve, reject) => {
            const transList = db.transaction('news', 'readwrite');
            const storeObject = transList.objectStore('news');
            storeObject.getAll().onsuccess = (event) => {
                if (event.type === 'success') {
                    resolve(event.target.result.length);
                }
            }
        });
    }

    static insertRecord = (storeObject, record) => {
        return new Promise((resolve, reject) => {
            const add = storeObject.add(record);
            add.onsuccess = (addResult) => {
                if (addResult.type === 'success') {
                    resolve(record._id);
                }
            }

        });
    };

    static getRecordPage = (storeObject, startPos, endPos) => {
        return new Promise((resolve, reject) => {
            const keyRangeValue = IDBKeyRange.bound(startPos, endPos);
            const items = [];
            storeObject.openCursor(keyRangeValue).onsuccess = (event) => {
                var cursor = event.target.result;
                if (cursor) {
                    items.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(items);
                }
            }
        });
    }

    static getRecordSlug = (storeObject, slug) => {
        return new Promise((resolve, reject) => {
            const storeObjectRequest = storeObject.index('slug');
            storeObjectRequest.get(slug).onsuccess = (getAllResult) => {
                if (getAllResult.type === 'success') {
                    resolve(getAllResult.target.result);
                }
            };

        });
    }
}


export default ServicesIndexedDB;
