import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { connect } from 'react-redux';

import Spinner from './UI/Spinner/Spinner';
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
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path='/games' component={Games} />
            <Route path='/login' exact render={() => <Login {...this.props} />} />
            <Route path="/logout" exact render={() => <Logout {...this.props} />} />
            <Route path='/signup' exact render={() => <SignUp {...this.props} />} />
            <Redirect from='/' to='/games' />
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
