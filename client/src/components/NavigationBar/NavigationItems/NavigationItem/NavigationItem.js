import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';

import store from '../../../../storage/store';
import * as actions from '../../../../storage/actions/actions';

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

const leaveRoom = () => {
    const room = store.getState().game.room;
    if (room.name) {
        store.dispatch(actions.leaveRoom(room.name));
    }
}

function getLink(props) {
    return (
        <li className="nav-item" onClick={() => leaveRoom()} >
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
        dropdownItems = props.dropdownItems.map(item => {
            let dropDownItem = (
                <span key={item.key} className="dropdown-item" >
                    {item.label}
                </span>
            );

            if (item.link) {
                dropDownItem = (
                    <NavLink key={item.key} to={item.link ? item.link : '/'} className="dropdown-item" exact={item.exact}>
                        {item.label}
                    </NavLink>
                )
            }
            return dropDownItem;
        });
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