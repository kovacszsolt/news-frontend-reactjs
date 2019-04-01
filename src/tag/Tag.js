import React, {Component} from 'react';
import AppCommonCard from '../common/card/Card';
import './Tag.css';
import Util from "../Util";
import ServicesIndexedDB from "../services/Services.indexeddb";

class AppFront extends Component {
    currentPage = 1;
    db;

    constructor(props) {
        super(props);
        this.state = {
            tweets: []
        }
    };

    componentDidMount() {
        this.initIndexedDB();

    };

    componentWillReceiveProps = (nextProps) => {
        this.readData(nextProps.match.params.slug);
    }

    readDataIndexedDB = (tag) => {
        const transList = this.db.transaction('tags', 'readwrite');
        const storeObject = transList.objectStore('tags');
        ServicesIndexedDB.getRecordTag(storeObject, tag).then((records) => {
            this.setState({tweets: records});
        });
    }

    initIndexedDB = () => {
        ServicesIndexedDB.createDatabase().then((db) => {
            this.db = db;
            this.readDataIndexedDB(this.props.match.params.slug);
        });
    }


    readData = (tag) => {
        this.readDataIndexedDB(tag);

    };

    render() {
        return (
            <div className="front__content" id={"content"}>
                {this.state.tweets.map((record) => {
                    return (
                        <AppCommonCard id={record.id} key={record.id} title={record.title}
                                       slug={record.slug}
                                       extension={record.extension}
                                       date={record.createtime}
                                       tags={Util.getTags(record.tags)} text={record.description}></AppCommonCard>
                    )
                })
                }
            </div>
        );
    };
}

export default (AppFront);
