import React , {memo} from 'react';

import GameLogo from './GameLogo/GameLogo';

const games = (props) => {
    const games = [];

    Object.keys(props.games).forEach(key => {
        const game = props.games[key];
        games.push((
            <div key={key} className='col-4'>
                <GameLogo name={game.name} src={game.src} onClick={() => props.gameSelected(key)} />
            </div>
        ));
    });

    return games;
};

export default memo(games);