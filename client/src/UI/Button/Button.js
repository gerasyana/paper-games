import React, { memo } from 'react';

const button = (props) => (
    <button {...props}>
        {props.children}
    </button>
)

export default memo(button);


