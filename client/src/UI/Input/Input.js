import React from 'react';

const input = (props) => {
    const input = (
        <div className="form-group">
            <label htmlFor={props.id}>{props.label}</label>
            <input
                type={props.type}
                className="form-control"
                id={props.id}
                placeholder={props.placeholder}
                onChange={props.onChange} />
        </div>
    );
    return input;
}

export default input;