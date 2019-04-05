import React, { memo } from 'react';

const button = (props) => {
    console.log('render button')
    return (
        <button {...props}>
        {props.children}
    </button>
    )
}


export default memo(button);


