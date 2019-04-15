import React, { memo } from 'react';

import classes from './BoardMove.css';
import Button from '../../../UI/Button/Button';

const boardMove = (props) => (
    <td>
        <Button
            type="button"
            className={classes.boardMove}
            {...props}
            disabled={props.value}>
            {props.value}
        </Button>
    </td>
)

export default memo(boardMove);