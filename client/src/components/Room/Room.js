import React, { memo } from 'react';

import Button from '../../UI/Button/Button';

const room = (props) => (
    <div key={props.name} className='col-4'>
        <div className="card border-primary mb-3" >
            <div className="card-header">
                <h5>{props.name}</h5>
            </div>
            <div className="card-body">
                <h6 className="card-title">{props.users.map(user => user.username).join(',')}</h6>
                {
                    props.free ?
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
);

export default memo(room);