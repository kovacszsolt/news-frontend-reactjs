import React, {Component} from 'react';
import AppCommonCard from '../common/card/Card';
import './Tag.css';
import ServicesWebSQL from "../services/Services.websql";

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
        ServicesWebSQL.createDatabase().then((db) => {
            this.db = db;
            this.readData(this.props.match.params.slug);
        });
    };

    componentWillReceiveProps(nextProps) {
        this.readData(nextProps.match.params.slug);
    }


    readData = (tag) => {
        ServicesWebSQL.getRecordTag(this.db, tag).then((records) => {
            this.setState({tweets: records});
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
