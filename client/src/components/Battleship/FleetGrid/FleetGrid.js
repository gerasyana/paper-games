import React, { memo } from 'react';

import * as classes from './FleetGrid.css';

const horizontalColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const fleetGrid = (props) => {
    const rows = [];

    rows.push(<div key='columns' className={classes.row}>
        {
            horizontalColumns.map(column => {
                const key = column + '-column-';
                return <div className={classes.fleetCellHeader} key={key}>{column}</div>
            })
        }
    </div >);

    for (let x = 0; x < 10; x++) {
        const cells = props.gridColumns
            .slice(x * 10, (x + 1) * 10)
            .map(item => {
                const shipClasses = [classes.cell];

                if (item.outOfBoundary) {
                    shipClasses.push(classes.outOfBoundary);
                } else if (item.selected || item.hovered) {
                    shipClasses.push(classes.selected);
                }

                return (<div className={shipClasses.join(' ')} id={item.id} key={item.id}></div>)
            });
        rows.push((
            <div key={'row-' + x} className={classes.row}>
                {cells}
            </div>
        ));
    }

    return (
        <div className={classes.fleetGrid} onClick={props.onClick} onMouseOver={props.onMouseOver}>
            {rows}
        </div>
    );
}

export default memo(fleetGrid);