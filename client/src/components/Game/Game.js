import React from 'react';
import './Game.css';

const game = (props) => {
    return (
        <div className='img-container' onClick={props.gameSelected}>
            <img src={props.src} alt={props.name} />
            <div className='img-content'>
                <h4>{props.name}</h4>
            </div>
        </div>
    )
};

export default game;