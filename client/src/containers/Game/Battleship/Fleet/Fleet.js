import React, { Component } from 'react';

import FleetGrid from '../../../../components/Battleship/FleetGrid/FleetGrid';

class Fleet extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.fleet !== this.props.fleet;
    }

    render() {
        const fleetMessage = this.props.playerCurrentUser ? 'Your fleet' : 'Enemy fleet';
        return (
            <div className='row justify-content-center'>
                <div className='col-sm-10'>
                    <h4 className='text-center m-3'>{fleetMessage}</h4>
                    <FleetGrid gridColumns={this.props.fleet.gridColumns} />
                </div>
            </div>
        );
    }
}

export default Fleet;