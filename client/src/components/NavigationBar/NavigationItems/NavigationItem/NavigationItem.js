import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';

const navigationItem = (props) => {
    let navItem = null;

    switch (props.type) {
        case 'link': {
            navItem = getLink(props);
            break;
        }
        case 'dropdown': {
            navItem = getDrowdown(props);
            break
        }
        default:
            navItem = getText(props);
            break;
    }
    return navItem;
}

function getLink(props) {
    return (
        <li className="nav-item">
            <NavLink to={props.link} className="nav-link" exact={props.exact}>
                {props.label}
            </NavLink>
        </li>
    )
}

function getText(props) {
    return (
        <li className="nav-item">
            <span className="nav-link no-cursor">{props.label}</span>
        </li>
    )
}

function getDrowdown(props) {
    let dropdownItems;

    if (props.dropdownItems) {
        dropdownItems = props.dropdownItems.map(item => (
            <NavLink key={item.key} to={item.link ? item.link : '/'} className="dropdown-item" exact={item.exact}>
                {item.label}
            </NavLink>
        ));
    }

    return (
        <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href='/' data-toggle="dropdown" id="download">
                {props.label}
                <span className="caret"></span>
            </a>
            <div className="dropdown-menu" aria-labelledby="download">
                {dropdownItems}
            </div>
        </li>
    )
}

export default memo(navigationItem);