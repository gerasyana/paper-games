import React, { memo } from 'react';

const modal = (props) => (
    <div className="modal fade" id={props.id} tabIndex="-1" role="dialog" aria-labelledby='modalTitle' aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id='modalTitle'>{props.title}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {props.children[0]}
                </div>
                <div className='modal-footer'>
                    {props.children[1]}
                </div>
            </div>
        </div>
    </div>
)

export default memo(modal);