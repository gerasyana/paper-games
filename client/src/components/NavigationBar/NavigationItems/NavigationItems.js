import React from 'react';

import Aux from '../../../hoc/Aux/Aux';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => {
    const dropdownItems = [
        {
            key: 'tic-tack-toe',
            label: 'Tic Tack Toe',
            link: '/game/tick-tack-toe'
        }
    ];

    let navItemsRight = (
        <Aux>
            <NavigationItem type="link" link='/login' label="Login" />
        </Aux>
    )

    let navItemsLeft = (
        <Aux>
            <NavigationItem type="link" link='/' dropdownItems={dropdownItems} label="Home" />
            <NavigationItem type="dropdown" dropdownItems={dropdownItems} label="Games" />
        </Aux>
    )

    if (props.isAuthenticated) {
        navItemsRight = (
            <Aux>
                <NavigationItem type="text" label='0 scores' />
                <NavigationItem type="text" label={props.user.username} />
                <NavigationItem type="link" link='/logout' label="Logout" />
            </Aux>
        )
    }

    return (
        <Aux>
            <ul className="nav navbar-nav navbar-nav">
                {navItemsLeft}
            </ul>
            <ul className="nav navbar-nav navbar-nav ml-auto">
                {navItemsRight}
            </ul>
        </Aux>
    );
}
export default navigationItems;