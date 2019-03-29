import React, {Component, Fragment} from 'react';
import './App.css';
import ReactGA from 'react-ga';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AppCommonHeader from './common/header/Header';
import AppFront from './front/Front';
import AppTweet from './tweet/Tweet';
import AppTag from './tag/Tag';
import AppNotfound from './notfound/Notfound';
import AppSearch from './search/Search';
import {Helmet} from "react-helmet";
import ServicesRemote from "./services/Services.remote";
import ServicesIndexedDB from "./services/Services.indexeddb";

class App extends Component {
    db;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            privacy: document.cookie.split(';').find(cookie => cookie.trim() === 'privacy=allow') === undefined ? false : true
        };
        this.init();
    }

    initIndexedDB = () => {
        ServicesIndexedDB.createDatabase().then((db) => {
            this.db = db;
            ServicesIndexedDB.getRecordount(db).then((recordCount) => {
                const updateKey = localStorage.getItem('UPDATEKEY');
                ServicesRemote.getUpdate().then((updateRecords) => {
                    if (String(updateRecords.lastAddDate) !== updateKey) {
                        console.log('db update');
                        this.initIndexedDBData();
                        localStorage.setItem('UPDATEKEY', updateRecords.lastAddDate);
                    } else {
                        console.log('db no update');
                        this.setState({isLoading: false});
                    }
                });
            });
        });
    };

    initIndexedDBData = () => {
        ServicesRemote.getAll().then((records) => {
            const transList = this.db.transaction('news', 'readwrite');
            const storeObject = transList.objectStore('news');
            const transTagList = this.db.transaction('tags', 'readwrite');
            const storeTagObject = transTagList.objectStore('tags');
            records.map(record => record.slug = (record.meta === undefined ? '' : record.meta.slug));
            records = records.filter(record => record.slug !== '');
            records.map(record => record.title = record.meta.title);
            records.map(record => record.description = record.meta.description);
            records.map(record => record.extension = record.meta.extension);
            records.map(record => record.createtime = record.meta.createtime);

            const tagRecords = [];
            records.forEach((record) => {
                record.tags.forEach((tag) => {
                    const _record = {...record};
                    _record.tag = tag;
                    tagRecords.push(_record);
                });
            });
            Promise.all(records.map(record => ServicesIndexedDB.insertRecord(storeObject, record))).then(() => {
                this.setState({isLoading: false});
            });
            Promise.all(tagRecords.map(tagRecord => ServicesIndexedDB.insertRecord(storeTagObject, tagRecord))).then(() => {
                this.setState({isLoading: false});
            });
        });
    }

    init() {
        this.initIndexedDB();
    }

    addCookie = () => {
        const _date = new Date();
        _date.setFullYear(_date.getFullYear() + 1);
        document.cookie = "privacy=allow; expires=" + _date.toGMTString();
        this.setState({privacy: true});
    }

    render() {
        ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_KEY);
        ReactGA.pageview(window.location.pathname + window.location.search);
        if (this.state.isLoading) {
            return (
                <div className="app__center">
                    <span className="fas fa-spinner fa-spin"></span>
                </div>
            )
        } else {
            return (
                <Fragment>
                    {(!this.state.privacy) ?
                        <div className="app__overlay">
                            <div className="app__overlay__popup">
                                <h2>Fontos</h2>
                                <div className="app__overlay__popup__content">
                                    Az oldal cookie-kat használ a jobb működés érdekében!
                                </div>
                                <div className="app__overlay__popup__footer">
                                    <button onClick={this.addCookie}>Rendben</button>
                                </div>
                            </div>
                        </div>
                        : ''}
                    <Router>
                        <Fragment>
                            <AppCommonHeader/>
                            <div className="w-100 p-3">
                                <Switch>
                                    <Route path="/" exact component={AppFront}/>
                                    <Route path="/notfound" exact component={AppNotfound}/>
                                    <Route path="/search" exact component={AppSearch}/>
                                    <Route path="/search/:slug" exact component={AppSearch}/>
                                    <Route path="/:slug" exact component={AppTweet}/>
                                    <Route path="/tag/:slug" exact component={AppTag}/>
                                </Switch>
                            </div>
                        </Fragment>
                    </Router>
                </Fragment>
            );
        }
    }
}

export default App;
