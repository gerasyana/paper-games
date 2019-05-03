import React, { memo } from 'react';

import Aux from '../../../hoc/Aux/Aux';
import NavigationItem from './NavigationItem/NavigationItem';
import games from '../../../constants/games';

const navigationItems = (props) => {
    const gamesDropdownItems = Object.keys(games).map(key => {
        const game = games[key];
        const { label, url} = game;
        return {
            type: 'link',
            link : url,
            key,
            label
        }
    })

    let navItemsRight = (
        <Aux>
            <NavigationItem type="link" link='/login' label="Login" />
            <NavigationItem type="link" link='/signup' label="Sign up" />
        </Aux>
    )

    let navItemsLeft = (
        <Aux>
            <NavigationItem type="link" link='/' label="Home" />
            <NavigationItem type="dropdown" dropdownItems={gamesDropdownItems} label="Games" />
        </Aux>
    )

    if (props.isAuthenticated) {

        const usersItems = [
            {
                key: 'points',
                label: `${props.user.totalPoints} points`
            },
            {
                key: 'logout',
                label: 'Logout',
                link: '/logout'
            },
        ];


        navItemsRight = (
            <Aux>
                <NavigationItem type="link" link='/rooms' label={`${props.rooms} rooms `} />
                <NavigationItem type="text" label={`${props.usersOnline} users online`} />
                <NavigationItem type="dropdown" dropdownItems={usersItems} label={props.user.username} />
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