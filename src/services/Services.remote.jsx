class UPDATESTATE {
    static NEW = 0;
    static TIME = 1;
    static NOCHANGE = 2;
}

const STORAGE_KEY_UPDATE = 'UPDATE';
const UPDATEKEY_URL = process.env.REACT_APP_BACKEND_SERVER + 'update/';
const LIST_URL = process.env.REACT_APP_BACKEND_SERVER + 'list/';
const REFRESH_TIME = 60;

class ServicesRemote {
    /*
    0: first start
     */
    static update() {
        if (localStorage.getItem(STORAGE_KEY_UPDATE) === null) {
            return UPDATESTATE.NEW;
        } else {
            if ((Number(JSON.parse(localStorage.getItem(STORAGE_KEY_UPDATE)).date) + (REFRESH_TIME * 1000)) > Date.now()) {
                return UPDATESTATE.NOCHANGE;
            } else {
                return UPDATESTATE.TIME;
            }
        }
    }

    static getFromServer() {
        return new Promise((resolve, reject) => {
            return Promise.all([ServicesRemote.getServerTweetList(), ServicesRemote.getServerUpdate()]).then((response) => {
                if (response[0] === undefined) {
                    response[0] = 'dummy';
                }
                const tweetList = response[0];
                const data = {
                    update: response[1].value,
                    tweetList: tweetList
                };
                resolve(data);
            })
        })
    }

    static getServerTweetList() {
        return new Promise((resolve, reject) => {
            fetch(LIST_URL)
                .then(res => res.json())
                .then(
                    (result) => {
                        resolve(result);
                    },
                    (error) => {
                    }
                )
        });
    }


    static getServerUpdate() {
        return new Promise((resolve, reject) => {
            fetch(UPDATEKEY_URL)
                .then(res => res.json())
                .then(
                    (result) => {
                        resolve(result);
                    },
                    (error) => {
                    }
                )
        });
    }
}

export default ServicesRemote;
