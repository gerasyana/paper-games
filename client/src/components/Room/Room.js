import React, { memo } from 'react';

import Button from '../../UI/Button/Button';

const room = (props) => {
    const joinEnabled = props.players.length === 1 && !props.players.find(player => player.id === props.userId);

    return (
        <div key={props.name} className='col-md-3 col-margin-fixed'>
            <div className="card border-primary mb-3">
                <div className="card-header">
                    <h5>{props.name}</h5>
                </div>
                <div className="card-body">
                    <h6>{props.gameId}</h6>
                    <h6 className="card-title">{props.players.map(player => player.username).join(',')}</h6>
                    {
                        joinEnabled ?
                            <Button
                                type='button'
                                className="btn btn-primary"
                                onClick={() => props.join(props.name)}>
                                Join
                            </Button> :
                        null
                    }
                </div>
            </div>
        </div>
    )
}

export default memo(room);