import React, {Component} from 'react';
import AppCommonCard from '../common/card/Card';
import './Front.css';
import ServicesWebSQL from "../services/Services.websql";
import ServicesIndexedDB from "../services/Services.indexeddb";

class AppFront extends Component {
    currentPage = 1;
    db;

    constructor(props) {
        super(props);
        this.state = {
            pagesize: 9,
            tweets: []
        }
    };

    componentDidMount() {
        if (window.openDatabase === undefined) {
            this.initIndexedDB();
        } else {
            console.log('websql');
            this.initWebSQL();
        }
    };

    initIndexedDB = () => {
        ServicesIndexedDB.createDatabase().then((db) => {
            this.db = db;
            this.readData();
        });
    };

    initWebSQL = () => {
        ServicesWebSQL.createDatabase().then((db) => {
            this.db = db;
            this.readData();
        });
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    };


    trackScrolling = () => {
        const wrappedElement = document.getElementById('content');
        if (Math.floor(wrappedElement.getBoundingClientRect().bottom) <= window.innerHeight) {
            document.removeEventListener('scroll', this.trackScrolling);
            this.readData();
        }
    };

    readData = () => {
        this.componentWillUnmount();
        if (window.openDatabase === undefined) {
            this.readDataIndexedDB();
        } else {
            this.readDataWebSQL();
        }
    };

    readDataIndexedDB = () => {
        const transList = this.db.transaction('news', 'readwrite');
        const storeObject = transList.objectStore('news');
        ServicesIndexedDB.getRecordPage(storeObject, this.currentPage * this.state.pagesize, ((this.currentPage + 1) * this.state.pagesize) - 1).then((records) => {
            const tmp = this.state.tweets;
            tmp.push(...records);
            this.setState({tweets: tmp});
            this.currentPage++;
            document.addEventListener('scroll', this.trackScrolling);
        });
    };


    readDataWebSQL = () => {
        this.componentWillUnmount();
        ServicesWebSQL.getRecordPage(this.db, this.currentPage * this.state.pagesize).then((records) => {
            const tmp = this.state.tweets;
            tmp.push(...records);
            this.setState({tweets: tmp});
            this.currentPage++;
            document.addEventListener('scroll', this.trackScrolling);
        });
    };

    getTags = (tags) => {
        if (Array.isArray(tags)) {
            return tags;
        } else {
            return tags.split(',');
        }
    }

    render() {
        return (
            <div className="front__content" id={"content"}>
                {this.state.tweets.map((record) => {
                    return (
                        <AppCommonCard id={record.rowid} key={record.id} title={record.title}
                                       slug={record.slug}
                                       extension={record.extension}
                                       date={record.createtime}
                                       tags={this.getTags(record.tags)} text={record.description}></AppCommonCard>
                    )
                })
                }
            </div>
        );
    };
}

export default (AppFront);
