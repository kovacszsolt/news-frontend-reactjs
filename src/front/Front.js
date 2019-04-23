import React, {Component, Fragment} from 'react';
import AppCommonCard from '../common/card/Card';
import './Front.css';
import ServicesIndexedDB from "../services/Services.indexeddb";
import Util from "../Util";
import {Helmet} from "react-helmet";

class AppFront extends Component {
    currentPage = 1;
    db;

    constructor(props) {
        super(props);
        this.state = {
            pagesize: 9,
            tweets: [],
            storeObject: {}
        }
    };

    componentDidMount() {
        this.initIndexedDB();
    };

    initIndexedDB = () => {
        ServicesIndexedDB.createDatabase().then((db) => {
            this.db = db;
            this.readData();
        });
    };

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
        this.readDataIndexedDB();
    };

    readDataIndexedDB = () => {
        const transList = this.db.transaction('news', 'readwrite');
        const storeObject = transList.objectStore('news');
        ServicesIndexedDB.getRecordPage(storeObject, this.currentPage * this.state.pagesize, ((this.currentPage + 1) * this.state.pagesize) - 1).then((records) => {
            const tmp = this.state.tweets;
            tmp.push(...records);
            this.setState({tweets: tmp, storeObject: storeObject});
            this.currentPage++;
            document.addEventListener('scroll', this.trackScrolling);
        });
    };

    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>{process.env.REACT_APP_META_FRONT_TITLE}</title>
                    <meta name="description" content={process.env.REACT_APP_META_FRONT_DESCRIPTION}/>
                    <meta property="og:url"
                          content={window.location.href}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:title" content={process.env.REACT_APP_META_FRONT_TITLE}/>
                    <meta property="og:description" content={process.env.REACT_APP_META_FRONT_DESCRIPTION}/>
                    <meta property="og:image"
                          content={process.env.REACT_APP_META_FRONT_IMAGE}/>
                </Helmet>
                <div className="front__content" id={"content"}>
                    {this.state.tweets.map((record) => {
                        return (
                            <AppCommonCard id={record.id}
                                           storeObject={this.state.storeObject}
                                           key={record.id}
                                           title={record.title}
                                           slug={record.slug}
                                           new={record.new}
                                           extension={record.extension}
                                           date={record.createtime}
                                           tags={Util.getTags(record.tags)} text={record.description}></AppCommonCard>
                        )
                    })
                    }
                </div>
            </Fragment>
        );
    };
}

export default (AppFront);
