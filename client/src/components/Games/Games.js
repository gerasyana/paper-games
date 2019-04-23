import React, { memo } from 'react';

import GameLogo from './GameLogo/GameLogo';

const games = (props) => (
    Object.keys(props.games).map(key => {
        const game = props.games[key];
        return (
            <div key={key} className='col-sm-4 col-margin-fixed' >
                <GameLogo name={game.name} src={game.src} onClick={() => props.gameSelected(key)} />
            </div>
        );
    })
)

export default memo(games);