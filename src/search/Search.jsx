import React, {Component} from 'react';
import './Search.css';
import ServicesWebSQL from "../services/Services.websql";
import {Link} from "react-router-dom";

class AppSearch extends Component {
    db;

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            tweets: []
        }
    };

    highlightText = (name, query) => {
        if (name !== null) {
            var regex = new RegExp("(" + query + ")", "gi");
            return name.replace(regex, "<mark>$1</mark>");
        } else {
            return name;
        }

    };


    componentDidMount() {
        ServicesWebSQL.createDatabase().then((db) => {
            this.db = db;
            if (this.props.match.params.slug !== undefined) {
                this.setState({searchText: this.props.match.params.slug});
                this.search(this.props.match.params.slug);
            }
        });
    };

    handleChange = (event) => {
        this.setState({searchText: event.target.value});
        this.search(event.target.value);
    }

    search = (searchText) => {
        if (searchText.length > 2) {
            ServicesWebSQL.findTitle(this.db, searchText).then((records) => {
                window.history.pushState({}, "another page", '/search/' + searchText);
                this.setState({tweets: records});
            });
        } else {
            this.setState({tweets: []});
        }
    };

    render() {
        return (
            <div className="search">
                <div className="search__header">
                    <input type="text" value={this.state.searchText} placeholder="Type Something"
                           onChange={this.handleChange}/>
                    <span>{this.state.tweets.length} pcs</span>
                </div>
                {(this.state.tweets.length !== 0) ?
                    <div className="search__list">
                        {this.state.tweets.map((record) => {
                            return (
                                <div key={record.id} className="search__list__item">
                                    <Link className="search__list__item-title common__tags"
                                          to={`/${record.slug}`}
                                          dangerouslySetInnerHTML={{__html: this.highlightText(record.title, this.state.searchText)}}></Link>
                                    <div
                                        className="search__list__item-description"
                                        dangerouslySetInnerHTML={{__html: this.highlightText(record.description, this.state.searchText)}}></div>
                                    <div className="common__tags padding__left-05">
                                        {record.tags.split(',').map((tag) => {
                                            return (
                                                <Link key={tag} to={`/tag/${tag}`}>{tag}</Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    : <div className="search__notfound">
                        <img src="/images/oops.jpg" alt="Not Found"/>
                    </div>}
            </div>
        );
    };
}

export default (AppSearch);
