import React, { Component } from 'react';
import { connect } from 'react-redux'

import * as classes from './ShipsPlacement.css';
import * as actions from '../../../../../storage/actions/actions';
import FleetGrid from '../../../../../components/Battleship/FleetGrid/FleetGrid';
import Aux from '../../../../../hoc/Aux/Aux';
import Button from '../../../../../UI/Button/Button';

const ships = {
    'carrier': {
        label: 'Aircraft carrier',
        size: 5,
        count: 1
    },
    'battleship': {
        label: 'Battleship',
        size: 4,
        count: 1
    },
    'cruiser': {
        label: 'Cruiser',
        size: 3,
        count: 1
    },
    'destroyer': {
        label: 'Destroyer',
        size: 2,
        count: 2
    },
    'submarine': {
        label: 'Submarine',
        size: 1,
        count: 2
    },
}

class ShipsPlacement extends Component {

    constructor(props) {
        super(props);
        const playerShips = {};
        Object.keys(ships).forEach(shipId => {
            const { size, count } = ships[shipId];
            for (let i = count; i > 0; i--) {
                playerShips[`${shipId}-${i}`] = {
                    key: `${shipId}-${i}`,
                    id: shipId,
                    size
                };
            }
        });

        this.state = {
            gridColumns: new Array(100).fill(null).map((value, index) => ({
                id: `gridColumn-${index}`,
                selected: false,
                hovered: false
            })),
            ships: playerShips,
            placedShips: [],
            selectedShip: null,
            selectedShipColumns: [],
            horizontalShip: true
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.selectedShip !== nextState.selectedShip ||
            this.state.gridColumns !== nextState.gridColumns ||
            this.state.horizontalShip !== nextState.horizontalShip;
    }

    selectShip = (id) => {
        const ships = { ...this.state.ships };
        const selectedShip = { ...ships[id] };
        Object.keys(ships).forEach(key => ships[key].selected = id === key);
        this.setState({
            selectedShip,
            ships
        });
    }

    placeShip = () => {
        if (this.state.shipOutOfBoundary || !this.state.selectedShip) {
            return;
        }

        const placedShips = [...this.state.placedShips];
        const ships = { ...this.state.ships };
        delete ships[this.state.selectedShip.key];

        const gridColumns = this.state.gridColumns
            .map((item, index) => {
                if (this.state.selectedShipColumns.includes(index)) {
                    item.selected = true;
                }
                return item;
            });
        placedShips.push({
            id: this.state.selectedShip.id,
            columns: [...this.state.selectedShipColumns]
        });

        if (Object.keys(ships).length === 0) {
            this.updateGameBoard(placedShips);
        } else {
            this.setState({
                ships,
                selectedShip: null,
                selectedShipColumns: [],
                gridColumns,
                placedShips
            });
        }
    }

    updateGameBoard = (placedShips) => {
        this.props.updateGameBoard({
            room: this.props.room.name,
            gameBoard: {
                fleets: [
                    ...this.props.fleets,
                    {
                        playerId: this.props.user.id,
                        shipsAreSet: true,
                        ships: placedShips
                    }
                ]
            }
        });
    }

    gridColumnHovered = (event) => {
        const id = event.target.id;

        if (!this.state.selectedShip || id.indexOf('gridColumn-') === -1) {
            return;
        }
        const { size } = this.state.selectedShip;
        const index = +this.state.gridColumns.findIndex(column => column.id === id);
        const currentRow = Math.floor(index / 10);

        const selectedShipColumns = [...new Array(size)]
            .map((item, i) => this.state.horizontalShip ? index + i : index + 10 * i)
            .filter(item => this.state.horizontalShip ? Math.floor(item / 10) !== currentRow + 1 : item < 100);
        const columnsFilled = this.state.gridColumns
            .filter((column, i) => selectedShipColumns.includes(i))
            .reduce((filled, column) => {
                if (column.selected) {
                    filled = true;
                }
                return filled;
            }, false);
        const shipOutOfBoundary = columnsFilled || selectedShipColumns.length !== size;

        const gridColumns = this.state.gridColumns.map((gridColumn, i) => {
            return {
                ...gridColumn,
                outOfBoundary: shipOutOfBoundary && selectedShipColumns.includes(i),
                hovered: selectedShipColumns.includes(i)
            }
        })
        this.setState({
            shipOutOfBoundary,
            gridColumns,
            selectedShipColumns: selectedShipColumns
        });
    }

    setOrientation = (horizontalShip) => {
        this.setState({ horizontalShip })
    }

    leaveRoom = () => {
        this.props.leaveRoom(this.props.room.name);
    }

    render() {
        const ships = Object.values(this.state.ships).map(ship => {
            const shipCells = [], shipClasses = [classes.ship];

            for (let i = ship.size; i > 0; i--) {
                shipCells.push(<div key={`ship-${ship.key}-${i}`} className={classes.shipCell}></div>)
            }

            if (ship.selected) {
                shipClasses.push(classes.shipSelected);
            }

            return (
                <div className='col-12 p-0' key={ship.key}>
                    <div className={shipClasses.join(' ')} onClick={() => this.selectShip(ship.key)}>
                        {shipCells}
                    </div>
                </div>
            )
        });

        const shipsPanel = (
            <Aux>
                <div className={classes.orientation} >
                    <span
                        className={this.state.horizontalShip ? classes.orientationSelected : null}
                        onClick={() => this.setOrientation(true)}>
                        Horizontal
                    </span>  &nbsp; &nbsp; &nbsp;
                    <span
                        className={!this.state.horizontalShip ? classes.orientationSelected : null}
                        onClick={() => this.setOrientation(false)}>
                        Vertical
                    </span>
                </div>
                <div className='row' style={{ width: '200px' }}>
                    {ships}
                </div>
            </Aux>
        );

        return (
            <div className={'row justify-content-center ' + classes.row}>
                <div className='col-lg-5 m-4'>
                    <FleetGrid
                        gridColumns={this.state.gridColumns}
                        onClick={this.placeShip}
                        shipSelected={this.state.selectedShip}
                        onMouseOver={this.gridColumnHovered} />
                </div>
                <div className='col-lg-3 m-4'>
                    <div className={classes.shipsPanel}>
                        {shipsPanel}
                    </div>
                    <div className={classes.leaveRoom}>
                        <Button
                            id="closeBtn"
                            type="button"
                            className="btn btn-secondary"
                            onClick={this.leaveRoom}>
                            Leave Game
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        room: state.game.room,
        user: state.auth.user,
        fleets: state.game.gameBoard.fleets
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        updateGameBoard: (data) => dispatch(actions.updateGameBoard(data)),
        leaveRoom: (room) => dispatch(actions.leaveRoom(room))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(ShipsPlacement);