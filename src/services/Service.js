import ServicesRemote from "./Services.remote";
import ServicesIndexedDB from "./Services.indexeddb";

export const addRecordFromRemote = (storeTweetObject) => {
    ServicesRemote.getServerTweetList().then((records) => {
        //const storeTweetObject = this.servicesIndexedDB.getStoreTweetObject();
        Promise.all(records.map(record => ServicesIndexedDB.addTweet(record, storeTweetObject))).then((q) => {
            }
        );
    });
}
