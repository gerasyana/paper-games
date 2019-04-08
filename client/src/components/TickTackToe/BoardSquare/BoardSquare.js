import React , {memo} from 'react';

import classes from './BoardSquare.css';
import Button from '../../../UI/Button/Button';

const boardSquare = (props) => (
    <td>
        <Button
            type="button"
            className={classes.boardSquare}
            {...props}>
            {props.value}
        </Button>
    </td>
)

export default memo(boardSquare);