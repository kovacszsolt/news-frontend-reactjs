import React, {Component} from 'react';
import AppCommonCard from '../common/card/Card';
import './Front.css';
import ServicesWebSQL from "../services/Services.websql";

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
        ServicesWebSQL.createDatabase().then((db) => {
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
        ServicesWebSQL.getRecordPage(this.db, this.currentPage * this.state.pagesize).then((records) => {
            const tmp = this.state.tweets;
            tmp.push(...records);
            this.setState({tweets: tmp});
            this.currentPage++;
            document.addEventListener('scroll', this.trackScrolling);
        });
    };

    render() {
        return (
            <div className="front__content" id={"content"}>
                {this.state.tweets.map((record) => {
                    return (
                        <AppCommonCard id={record.rowid} key={record.rowid} title={record.title}
                                       slug={record.slug}
                                       extension={record.extension}
                                       date={record.createtime}
                                       tags={record.tags.split(',')} text={record.description}></AppCommonCard>
                    )
                })
                }
            </div>
        );
    };
}

export default (AppFront);
