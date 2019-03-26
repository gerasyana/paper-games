import React, { Component } from 'react';
import { Switch, Route } from 'react-router';

import Game from '../Game/Game';
import Games from '../../components/Games/Games';
import games from '../../constants/games';

class Home extends Component {

    openGameDetails = (id) => {
        this.props.history.push(`/game/${id}`);
    }

    render() {
        return (
            <Switch>
                <Route path='/game/:id' exact component={Game} />
                <Route path='/' exact>
                    <div className="body-container container">
                        <div className='row justify-content-around'>
                            <Games games={games} gameSelected={this.openGameDetails} />
                        </div>
                    </div>
                </Route>
            </Switch>
        )
    }
}

export default Home;