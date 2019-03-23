class ServicesWebSQL {
    static getNews = () => {

    }
    static createDatabase = () => {
        return new Promise((resolve, reject) => {
            let db = window.openDatabase('itcrowd', '1.0', 'News Database', 100 * 1024 * 1024);
            db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS news (createtime,status,title,url,description,slug,extension)');
                resolve(db);
            })
        })
    };
    static getRecordount = (db, startPos) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT COUNT(rowid) as count FROM news ', [], (tx, results) => {
                    resolve(results.rows[0]['count']);
                });
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
