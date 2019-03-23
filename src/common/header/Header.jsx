import React, {Component} from 'react';
import './Header.css';
import {Link} from "react-router-dom";

class AppCommonheader extends Component {

    render() {
        return (
            <div className="header">
                <Link to={'/'} className="header__title">News Frontend</Link>
                <Link to={'/search'} className="header__title">Search</Link>
            </div>
        );

    }
}

export default (AppCommonheader);
