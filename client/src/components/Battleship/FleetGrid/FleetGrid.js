import React, { memo } from 'react';

import * as classes from './FleetGrid.css';

const horizontalColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const fleetGrid = (props) => {
    const rows = [];

    rows.push(<div key='columns' className={classes.row}>
        <div className={classes.gridCellHeaderEmpty} key='empty-cell'></div>
        {
            horizontalColumns.map(column => {
                const key = column + '-column-';
                return <div className={classes.gridCellHeader} key={key}>{column}</div>
            })
        }
    </div >);

    for (let x = 0; x < 10; x++) {
        const cells = props.gridColumns
            .slice(x * 10, (x + 1) * 10)
            .map(item => {
                const shipClasses = [classes.cell, 'text-center'];

                if (props.readOnlyMode) {
                    shipClasses.push(classes.readOnly);

                    if (item.shipDestroyed) {
                        shipClasses.push(classes.destroyed);
                    } else if (item.moved) {
                        shipClasses.push(classes.moved);
                    } else if (item.selected) {
                        shipClasses.push(classes.selected);
                    }
                } else {
                    if (item.outOfBoundary) {
                        shipClasses.push(classes.outOfBoundary);
                    } else if (item.shipDestroyed) {
                        shipClasses.push(classes.destroyed);
                    } else if (item.moved) {
                        shipClasses.push(classes.moved);
                    } else if (item.selected || item.hovered) {
                        shipClasses.push(classes.selected);
                    } else {
                        shipClasses.push(classes.empty);
                    }
                }
                return (<div className={shipClasses.join(' ')} id={item.id} key={item.id}>
                    {item.inTarget ? <h3>X</h3> : null}
                </div>)
            });
        rows.push((
            <div key={'row-' + x} className={classes.row}>
                <div className={classes.gridRowNumber} key={'fleetRowNumber-' + 1}>{x + 1}</div>
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