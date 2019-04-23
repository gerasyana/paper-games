import React, { memo } from 'react';

const button = (props) => {
    return (
        <button {...props}>
        {props.children}
    </button>
    )
}


export default memo(button);


