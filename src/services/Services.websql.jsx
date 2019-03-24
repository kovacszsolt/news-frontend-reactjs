class ServicesWebSQL {

    static createDatabase = () => {
        return new Promise((resolve, reject) => {
            let db = window.openDatabase('itcloud', '1.0', 'News Database', 100 * 1024 * 1024);
            db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS news (id,createtime,status,title,url,description,slug,extension,tags)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS tags (id,title)');
                resolve(db);
            })
        })
    };
    /*
        static createDatabase = () => {
            return new Promise((resolve, reject) => {
                let db = window.openDatabase('it', '1.0', 'News Database', 100 * 1024 * 1024);
                db.transaction(function (tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS news (createtime,status,title,url,description,slug,extension)');
                    resolve(db);
                })
            })
        };
        */
    static getRecordount = (db, startPos) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT COUNT(rowid) as count FROM news ', [], (tx, results) => {
                    resolve(results.rows[0]['count']);
                });
            });
        });
    }

    static insertRecord = (tx, record) => {
        return new Promise((resolve, reject) => {
            tx.executeSql('INSERT INTO news(id,createtime,status,title,url,description,slug,extension,tags) VALUES (?,?,?,?,?,?,?,?,?)',
                [record._id, record.created_at, record.status, record.meta.title, record.meta.url, record.meta.description, record.meta.slug, record.meta.extension, record.tags.join(',')], (tx1) => {
                    resolve(record._id);
                });

        });
    };

    static insertRecordTag = (tx, id, title) => {
        return new Promise((resolve, reject) => {
            tx.executeSql('INSERT INTO tags(id,title) VALUES (?,?)',
                [id, title], (tx1) => {
                    resolve(id);
                });
        });
    }


    static getRecordPage = (db, startPos) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT rowid,* FROM news LIMIT ' + startPos + ', 9', [], (tx, results) => {
                    resolve(Array.from(results.rows));
                });
            });
        });
    }

    static getRecordSlug = (db, slug) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT rowid,* FROM news WHERE slug="' + slug + '"', [], (tx, results) => {
                    resolve(results.rows[0]);
                });
            });
        });
    }
    static getRecordTag = (db, tag) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('select DISTINCT news.rowid, news.* from tags inner join news ON (tags.id=news.id AND tags.title="' + tag + '")', [], (tx, results) => {
                    resolve(Array.from(results.rows));
                });
            });
        });
    }

    static findTitle = (db, text) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT rowid,* FROM news WHERE title LIKE "%' + text + '%" OR description LIKE "%' + text + '%"', [], (tx, results) => {
                    resolve(Array.from(results.rows));
                });
            });
        });
    }

}


export default ServicesWebSQL;
