import React, { Component } from 'react';
import { Route, Switch } from 'react-router';

import Layout from './hoc/Layout/Layout';
import Games from './containers/Games/Games';
import Login from './containers/Login/Login';
import Rooms from './containers/Rooms/Rooms';

class App extends Component {

  render() {
    const routes = (
      <Switch>
        <Route path='/rooms' exact component={Rooms} />
        <Route path='/login' exact component={Login} />
        <Route path={['/', '/games']} component={Games} />
      </Switch>
    );

    return (
      <Layout>
        {routes}
      </Layout>
    );
  }
}

export default App;
