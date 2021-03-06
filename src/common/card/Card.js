import React from 'react';
import './Card.css';
import {Link} from "react-router-dom";
import ServicesIndexedDB from "../../services/Services.indexeddb";

const AppCommonCard = (props) => {
    if (props.new === 1) {
        ServicesIndexedDB.setNew(props.storeObject, props.slug, 0);
    }
    return (
        <div className="common__card">
            <Link to={`/${props.slug}`}>
                <img className="common__card__image" alt={props.title}
                     src={process.env.REACT_APP_IMAGE_URL + '/size1/' + props.slug + "." + props.extension}/>
            </Link>
            <div className="common__card__content">

                <Link to={`/${props.slug}`} className="common__card__content__title">
                    {props.new === 1 &&
                    <span className="common__card__content__title__new">NEW</span>
                    }
                    <span>
                    {props.title}
                    </span>
                </Link>
                <div className="common__card__content__date">{props.date}</div>
                <div className="common__card__content__tags">
                    {props.tags.map((tag) => {
                        return (
                            <Link key={tag} to={`/tag/${tag}`}>{tag}</Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default AppCommonCard;
