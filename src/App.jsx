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

import ServicesWebSQL from "./services/Services.websql";
import ServicesIndexedDB from "./services/Services.indexeddb";

class App extends Component {
    db;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
        this.init();
    }

    insertWebSQLRecords = (records) => {
        return new Promise((resolve, reject) => {
            this.db.transaction((txmain) => {
                Promise.all(records.map(record => ServicesWebSQL.insertRecord(txmain, record))).then((insertOk) => {
                    resolve(true);

                });
            });
        });
    };

    insertWebSQLTagRecords = (records) => {
        return new Promise((resolve, reject) => {
            this.db.transaction((txmain) => {
                Promise.all(records.map(record => ServicesWebSQL.insertRecordTag(txmain, record.id, record.title))).then((insertOk) => {
                    resolve(true);
                });
            });
        });
    };

    initWebSQL = () => {
        ServicesWebSQL.createDatabase().then((db) => {
            this.db = db;
            db.transaction((txmain) => {
                txmain.executeSql('SELECT COUNT(*) AS rowcount FROM news', [], (tx, results) => {
                    if (parseInt(results.rows[0]['rowcount']) !== 0) {
                        this.setState({isLoading: false});
                    } else {
                        const tags = [];
                        ServicesRemote.getAll().then((records) => {
                            records.forEach((record) => {
                                record.tags.forEach((tag) => {
                                    tags.push({id: record._id, title: tag});
                                });
                            });
                            Promise.all([this.insertWebSQLTagRecords(tags), this.insertWebSQLRecords(records)]).then(() => {
                                this.setState({isLoading: false});
                            }).catch((e) => {
                            });
                        })
                    }
                });
            });
        });
    };

    initIndexedDB = () => {
        ServicesIndexedDB.createDatabase().then((db) => {
            this.db = db;
            ServicesIndexedDB.getRecordount(db).then((recordCount) => {
                if (recordCount === 0) {
                    ServicesRemote.getAll().then((records) => {
                        const transList = this.db.transaction('news', 'readwrite');
                        const storeObject = transList.objectStore('news');
                        records.map(record => record.slug = (record.meta === undefined ? '' : record.meta.slug));
                        records = records.filter(record => record.slug !== '');
                        records.map(record => record.title = record.meta.title);
                        records.map(record => record.description = record.meta.description);
                        records.map(record => record.extension = record.meta.extension);
                        records.map(record => record.createtime = record.meta.createtime);
                        Promise.all(records.map(record => ServicesIndexedDB.insertRecord(storeObject, record))).then((qq) => {
                            this.setState({isLoading: false});
                        });
                    });
                } else {
                    this.setState({isLoading: false});
                }
            });
        });
    };

    init() {
        if (window.openDatabase === undefined) {
            this.initIndexedDB();
        } else {
            this.initWebSQL();
        }
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
                    <Helmet>
                        <meta name="google-site-verification" content={process.env.REACT_APP_GOOGLE_SITE_VERIFICATION}/>
                    </Helmet>
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
