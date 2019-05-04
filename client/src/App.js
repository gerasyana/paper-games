import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router';
import { connect } from 'react-redux';

import Spinner from './UI/Spinner/Spinner';
import Layout from './hoc/Layout/Layout';
import Home from './containers/Home/Home';
import * as actions from './storage/actions/actions';

const Login = React.lazy(() => import('./containers/Auth/Login/Login'));
const Logout = React.lazy(() => import('./containers/Auth/Logout/Logout'));
const SignUp = React.lazy(() => import('./containers/Auth/SignUp/SignUp'));
const ResetPassword =  React.lazy(() => import('./containers/Auth/ResetPassword/ResetPassword'));

class App extends Component {

  componentDidMount() {
    this.props.checkAuthentication();
  }

  render() {
    return (
      <Layout>
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path='/login' exact render={() => <Login {...this.props} />} />
            <Route path='/signup' exact render={() => <SignUp {...this.props} />} />
            <Route path="/logout" exact render={() => <Logout {...this.props} />} />
            <Route path="/resetpassword" exact render={() => <ResetPassword {...this.props} />} />

            <Route path='/' component={Home} />
            <Redirect to='/' />
          </Switch>
        </Suspense>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}

const mapDispatchToState = (dispatch) => {
  return {
    checkAuthentication: () => dispatch(actions.checkAuthentication())
  }
}

export default connect(mapStateToProps, mapDispatchToState)(withRouter(App));
