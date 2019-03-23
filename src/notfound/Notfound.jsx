import React, {Component} from 'react';
import './Notfound.css';

class AppNotfound extends Component {


    render() {

        return (
            <div className="pagenotfound">
                <h1>Not Found</h1>
                <img src="/images/oops.jpg" alt="Not Found"/>
            </div>
        );
    }

}

export default (AppNotfound);
