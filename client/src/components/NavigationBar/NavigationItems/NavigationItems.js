import React, { memo } from 'react';

import Aux from '../../../hoc/Aux/Aux';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => {
    const gamesDropdownItems = [
        {
            key: 'tic-tack-toe',
            label: 'Tic Tack Toe',
            type: 'link',
            link: '/game/tick-tack-toe'
        }
    ];

    const usersItems = [
        {
            key: 'points',
            label: '0 points'
        },
        {
            key: 'logout',
            label : 'Logout',
            link: '/logout'
        },
    ];

    let navItemsRight = (
        <Aux>
            <NavigationItem type="link" link='/login' label="Login" />
        </Aux>
    )

    let navItemsLeft = (
        <Aux>
            <NavigationItem type="link" link='/' label="Home" />
            <NavigationItem type="dropdown" dropdownItems={gamesDropdownItems} label="Games" />
        </Aux>
    )

    if (props.isAuthenticated) {
        navItemsRight = (
            <Aux>
                <NavigationItem type="link" link='/rooms' label={`${props.rooms} rooms `} />
                <NavigationItem type="text" label={`${props.usersOnline} users online`} />
                <NavigationItem type="dropdown" dropdownItems={usersItems}  label={props.user.username}  />
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
export default memo(navigationItems);