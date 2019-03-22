import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import Games from './containers/Games/Games';
import * as actions from './storage/actions/actions';

const Login = React.lazy(() => import('./containers/Auth/Login/Login'));
const Logout = React.lazy(() => import('./containers/Auth/Logout/Logout'));
const SignUp = React.lazy(() => import('./containers/Auth/SignUp/SignUp'));

class App extends Component {

  componentDidMount() {
    this.props.checkAuthentication();
  }

  render() {
    return (
      <Layout>
        <Suspense fallback={<p>Loading</p>}>
          <Switch>
            <Route path='/login' exact render={() => <Login {...this.props} />} />
            <Route path="/logout" render={() => <Logout {...this.props} />} />
            <Route path='/signup' exact render={() => <SignUp {...this.props} />} />
            <Route path={['/', '/games']} component={Games} />
          </Switch>
        </Suspense>
      </Layout>
    );
  }
}

const mapDispatchToState = (dispatch) => {
  return {
    checkAuthentication: () => dispatch(actions.checkAuthentication())
  }
}

export default connect(null, mapDispatchToState)(App);
