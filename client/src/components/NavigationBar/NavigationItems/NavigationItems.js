import React from 'react';

import Aux from '../../../hoc/Aux/Aux';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => {
    const dropdownItems = [
        {
            key: 'tic-tack-toe',
            label: 'Tic Tack Toe',
            link: '/games/tic-tack-toe'
        }
    ];


    let navItems = (
        <Aux>
            <NavigationItem type="dropdown" dropdownItems={dropdownItems} label="Games" />
            <NavigationItem type="link" link='/login' label="Login" />
        </Aux>
    )

    if (props.isAuthenticated) {
        navItems = (
            <Aux>
                <NavigationItem type="dropdown" dropdownItems={dropdownItems} label="Games" />
                <NavigationItem type="link" link='/' label={props.user.username} />;
                <NavigationItem type="link" link='/logout' label="Logout" />
            </Aux>
        )
    }

    return (
        <ul className="nav navbar-nav navbar-nav ml-auto">
            {navItems}
        </ul>
    )
}
export default navigationItems;