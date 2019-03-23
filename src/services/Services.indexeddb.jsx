class ServicesIndexedDB {
    /*
        init() {
            return this.dbCreate().then((db) => {
                this.db = db;
                return true;
            });
        }
    */
    static getDb() {
        return new Promise((resolve, reject) => {
            const dbRequest = indexedDB.open('news', 1);

            dbRequest.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('tweetList')) {
                    const tweetListStore = db.createObjectStore('tweetList', {autoIncrement: true});
                    tweetListStore.createIndex('slug', 'slug', {unique: false});
                }
                if (!db.objectStoreNames.contains('tweetListTag')) {
                    const tweetListTagStore = db.createObjectStore('tweetListTag', {autoIncrement: true});
                    tweetListTagStore.createIndex('tag', 'tag', {unique: false});
                }
            };
            dbRequest.onsuccess = (event) => {
                if (event.type === 'success') {
                    const db = event.target.result;
                    resolve(db);
                }
            }
        });
    }

    static getStoreTweetObject(db) {
        const transTweetList = db.transaction('tweetList', 'readwrite');
        return transTweetList.objectStore('tweetList');
    }

    static getStoreTweetTagObject(db) {
        const transTweetList = db.transaction('tweetListTag', 'readwrite');
        return transTweetList.objectStore('tweetListTag');
    }

    static addTweet(record, db) {
        const transTweetList = db.transaction('tweetList', 'readwrite');
        const storeTweetObject = transTweetList.objectStore('tweetList');
        return new Promise((resolve, reject) => {
            const add = storeTweetObject.add(record);
            add.onsuccess = (addResult) => {
                if (addResult.type === 'success') {
                    resolve(true);
                }
            }

        });
    }

    static addTagTweet(record, db) {
        const transTweetList = db.transaction('tweetListTag', 'readwrite');
        const storeTweetObject = transTweetList.objectStore('tweetListTag');
        return new Promise((resolve, reject) => {
            const add = storeTweetObject.add(record);
            add.onsuccess = (addResult) => {
                if (addResult.type === 'success') {
                    resolve(true);
                }
            }

        });
    }

    static storeClear(storeObject) {
        return new Promise((resolve, reject) => {
            const add = storeObject.clear();
            add.onsuccess = (addResult) => {
                if (addResult.type === 'success') {
                    resolve(true);
                }
            }
        });
    }

    static storeCount(storeObject) {
        return new Promise((resolve, reject) => {
            const add = storeObject.count();
            add.onsuccess = (addResult) => {
                if (addResult.type === 'success') {
                    resolve(addResult.target.result);
                }
            }
        });
    }

    static get(storeObject, pageNumber = 1, pageSize = 6) {
        return new Promise((resolve, reject) => {
            let cursorPos = 0;
            const records = [];
            storeObject.openCursor().onsuccess = function (event) {
                if (event.type === 'success') {
                    const cursor = event.target.result;
                    if (cursor) {
                        if ((cursorPos >= (pageNumber - 1) * pageSize) && (cursorPos < (pageNumber * pageSize))) {
                            records.push(cursor.value)
                        }
                        cursorPos++;
                        cursor.continue();
                    } else {
                        resolve(records);
                    }
                }
            }
        });
    }

    static getOne(storeObject, slug) {
        return new Promise((resolve, reject) => {
            storeObject.get(slug).onsuccess = function (event) {
                if (event.type === 'success') {
                    resolve(event.target.result);
                }
            }
        });
    }

    static getAll(storeObject, tag) {
        return new Promise((resolve, reject) => {
            storeObject.get(tag).onsuccess = function (event) {
                if (event.type === 'success') {
                    resolve(event.target.result);
                }
            }
        });
    }

    static getTagAll(storeObject, tag) {
        return new Promise((resolve, reject) => {
            storeObject.getAll(tag).onsuccess = function (event) {
                if (event.type === 'success') {
                    resolve(event.target.result);
                }
            }
        });
    }

}

export default ServicesIndexedDB;
