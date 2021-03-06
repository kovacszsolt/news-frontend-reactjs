import React, {Component, Fragment} from 'react';
import './Tweet.css';
import {Helmet} from "react-helmet";
import ServicesIndexedDB from "../services/Services.indexeddb";

class AppTweet extends Component {
    db;

    constructor(props) {
        super(props);
        this.state = {
            tweet: null
        }
    }

    componentDidMount() {

        this.initIndexedDB();

    };

    initIndexedDB = () => {
        ServicesIndexedDB.createDatabase().then((db) => {
            this.db = db;
            this.readData(this.props.match.params.slug);
        });
    };


    componentWillReceiveProps(nextProps) {
        this.readData(nextProps.match.params.slug);
    }

    readData(slug) {
        this.readDataIndexedDB(slug);
    }

    readDataIndexedDB(slug) {
        const transList = this.db.transaction('news', 'readwrite');
        const storeObject = transList.objectStore('news');
        ServicesIndexedDB.getRecordSlug(storeObject, slug).then((record) => {
            this.setState({tweet: record})
        });
    }


    render() {
        if (this.state.tweet === null) {
            return null;
        } else {
            return (
                <Fragment>
                    <Helmet>
                        <title>{this.state.tweet.title}</title>
                        <meta name="description" content={this.state.tweet.content}/>
                        <meta property="og:url"
                              content={window.location.href}/>
                        <meta property="og:type" content="article"/>
                        <meta property="og:title" content={this.state.tweet.title}/>
                        <meta property="og:description" content={this.state.tweet.description}/>
                        <meta property="og:image"
                              content={process.env.REACT_APP_IMAGE_URL + '/size1/' + this.state.tweet.slug + "/size2.jpg"}/>
                    </Helmet>

                    <div className="tweet">
                        <img className="tweet__image" alt={this.state.tweet.title}
                             src={process.env.REACT_APP_IMAGE_URL+'/size1/' + this.state.tweet.slug + "." + this.state.tweet.extension}/>
                        <h1>{this.state.tweet.title}</h1>
                        <p>{this.state.tweet.description}</p>
                        <div className="tweet__link">
                            <a href={this.state.tweet.meta.url} target="_blank" rel="noopener noreferrer">Open
                                Content <span
                                    className="fas fa-angle-double-right"></span></a>
                        </div>
                    </div>
                </Fragment>
            );
        }
    }
}

export default (AppTweet);
