import React, { memo } from 'react';

import classes from './GameLogo.css';

const game = (props) => (
    <div className={classes.imgContainer} onClick={props.onClick ? props.onClick : null}>
        <img src={props.src} alt={props.name} />
        <div className={classes.imgContent}>
            <h4>{props.name}</h4>
        </div>
    </div>
)

export default memo(game);