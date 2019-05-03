import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../../storage/actions/actions';
import FleetGrid from '../../../../components/Battleship/FleetGrid/FleetGrid';

class Fleet extends Component {

    constructor(props) {
        super(props);
        const displayShips = Object.hasOwnProperty.call(this.props, 'readOnlyMode') ? this.props.readOnlyMode : false;
        const shipColumns = this.props.fleet.ships.reduce((columns, ship) => {
            columns.push(...ship.columns);
            return columns;
        }, []);

        this.state = {
            gridColumns: new Array(100).fill(null).map((value, index) => ({
                id: `gridColumn-${index}`,
                selected: displayShips && shipColumns.includes(index)
            }))
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.fleet.moves !== this.props.fleet.moves ||
            this.props.yourTurn !== nextProps.yourTurn;
    }

    madeMove = (event) => {
        if (this.props.readOnlyMode || !this.props.yourTurn) {
            return;
        }

        const id = event.target.id;
        const index = +this.state.gridColumns.findIndex(column => column.id === id);
        const moves = this.props.fleet.moves ? [...this.props.fleet.moves] : [];
        moves.push(index);

        const data = {
            room: this.props.room,
            gameBoard: {
                fleets: this.props.gameBoard.fleets
                    .map(fleet => fleet.playerId === this.props.fleet.playerId ? { ...fleet, moves } : fleet)
            }
        };
        this.props.playerMadeMove(data);
    }

    render() {
        const { ships } = this.props.fleet;
        const moves = this.props.fleet.moves ? [...this.props.fleet.moves] : [];

        const columnsToDestroy = ships.reduce((columns, ship) => {
            if (ship.destroyed) {
                columns.push(...ship.columns);
            }
            return columns;
        }, []);
        const targetColumns = ships.reduce((columns, ship) => {
            columns.push(...ship.columns);
            return columns;
        }, []);
        const gridColumns = this.state.gridColumns.map((column, index) => ({
            ...column,
            moved: moves && moves.includes(index),
            inTarget: moves && moves.includes(index) && targetColumns.includes(index),
            shipDestroyed: columnsToDestroy.includes(index)
        }));

        return (
            <div className='row justify-content-center'>
                <div className='col-sm-10'>
                    <FleetGrid
                        readOnlyMode={this.props.readOnlyMode || !this.props.yourTurn}
                        gridColumns={gridColumns}
                        onClick={this.madeMove} />
                    <h4 className='text-center m-1'>{this.props.player.username}</h4>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        room: state.game.room,
        yourTurn: state.game.gameBoard.yourTurn,
        gameBoard: state.game.gameBoard
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        playerMadeMove: (data) => dispatch(actions.playerMadeMove(data))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Fleet);
