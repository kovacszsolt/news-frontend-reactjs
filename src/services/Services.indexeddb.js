class ServicesIndexedDB {

    static createDatabase = () => {
        return new Promise((resolve, reject) => {

            const dbRequest = indexedDB.open(process.env.REACT_APP_DATABASE, 1);
            dbRequest.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('news')) {
                    const tweetListStore = db.createObjectStore('news', {autoIncrement: true});
                    tweetListStore.createIndex('slug', 'slug', {unique: false});

                    const tweetTagListStore = db.createObjectStore('tags', {autoIncrement: true});
                    tweetTagListStore.createIndex('tag', 'tag', {unique: false});
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

    static getRecordAll = (storeObject) => {
        return new Promise((resolve, reject) => {
            const storeObjectRequest = storeObject.index('slug');
            storeObjectRequest.getAll().onsuccess = (getAllResult) => {
                if (getAllResult.type === 'success') {
                    resolve(getAllResult.target.result);
                }
            };

        });
    }

    static search = (storeObject, text) => {
        return new Promise((resolve, reject) => {
            storeObject.getAll().onsuccess = (getAllResult) => {
                if (getAllResult.type === 'success') {
                    const records = getAllResult.target.result.filter((record) => {
                        let result;
                        if (record.title.toUpperCase().includes(text.toUpperCase()) || (record.description === null ? '' : record.description.toUpperCase().includes(text.toUpperCase()))) {
                            result = record;
                        }
                        return result;
                    });
                    resolve(records);
                }
            };

        });
    }

    static getRecordTag = (storeObject, tag) => {
        return new Promise((resolve, reject) => {
            const storeObjectRequest = storeObject.index('tag');
            storeObjectRequest.getAll(tag).onsuccess = (getAllResult) => {
                if (getAllResult.type === 'success') {
                    const records = [];
                    getAllResult.target.result.forEach((result) => {
                        if (records.find(record => record._id === result._id) === undefined) {
                            records.push(result);
                        }
                    });
                    resolve(records);
                }
            };

        });
    }
}


export default ServicesIndexedDB;
