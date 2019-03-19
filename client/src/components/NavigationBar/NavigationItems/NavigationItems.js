import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => {
    const dropdownItems = [
        {
            key : 'tic-tack-toe',
            label : 'Tic Tack Toe',
            link : '/games/tic-tack-toe'
        }
    ];
    return (
        <ul className="nav navbar-nav navbar-nav ml-auto">
            <NavigationItem type="link" link='/rooms' label="Rooms"/>
            <NavigationItem type="link" link='/login' label="Login" />
            <NavigationItem type="dropdown" dropdownItems={dropdownItems} label="Games" />
        </ul>
    )
}

export default navigationItems;