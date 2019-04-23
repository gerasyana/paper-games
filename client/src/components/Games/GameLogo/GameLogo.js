import React, { memo } from 'react';

import classes from './GameLogo.css';

const game = (props) => (
    <div className={classes.imgContainer} onClick={props.onClick}>
        <img className="img-fluid" src={props.src} alt={props.name} />
        <div className={classes.gameLabel} >
            <h4>{props.name}</h4>
        </div>
    </div>
)

export default memo(game);