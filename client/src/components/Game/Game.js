import React from 'react';

import classes from './Game.css';

const game = (props) => {
    return (
        <div className={classes.imgContainer} onClick={props.gameSelected}>
            <img src={props.src} alt={props.name} />
            <div className={classes.imgContent}>
                <h4>{props.name}</h4>
            </div>
        </div>
    )
};

export default game;