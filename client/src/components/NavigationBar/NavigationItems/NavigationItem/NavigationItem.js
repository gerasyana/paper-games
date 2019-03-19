import React from 'react';
import { NavLink } from 'react-router-dom';

const navigationItem = (props) => {
    let navItem = null;

    if (props.type === 'link') {
        navItem = (
            <li className="nav-item">
                <NavLink to={props.link} className="nav-link" exact={props.exact}>
                    {props.label}
                </NavLink>
            </li>
        );
    }

    if (props.type === 'dropdown') {
        let dropdownItems;

        if (props.dropdownItems) {
            dropdownItems = props.dropdownItems.map(item =>
                <NavLink key={item.key} to={item.link} className="dropdown-item" exact={item.exact}>
                    {item.label}
                </NavLink>
            );
        }
        navItem = (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href='/' data-toggle="dropdown" id="download">
                    {props.label}
                    <span className="caret"></span>
                </a>

                <div className="dropdown-menu" aria-labelledby="download">
                    {dropdownItems}
                </div>
            </li>)
    }
    return navItem;
}

export default navigationItem;