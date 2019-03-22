import React from 'react';
import { Redirect , withRouter} from 'react-router';
import { connect } from 'react-redux'

import Input from '../../../UI/Input/Input';
import Spinner from '../../../UI/Spinner/Spinner';
import * as actions from '../../../storage/actions/actions'
import { validateInput } from '../../../helpers/validation';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            controls: {
                username: {
                    id: 'username',
                    type: 'username',
                    label: 'Username',
                    value: null,
                    isValid : true,
                    errorMessage : null,
                    placeholder: 'Username'
                },
                password: {
                    id: 'password',
                    type: 'password',
                    label: 'Password',
                    value: null,
                    isValid : true,
                    errorMessage : null,
                    placeholder: 'Enter password'
                }
            }
        }
    }

    setControlValue = (event, key) => {
        const element = event.target;
        const control = { ...this.state.controls[key] }
        control.value = element.value;
        const controlsUpdated = {
            ...this.state.controls,
            [key]: control
        };
        this.setState({ controls: controlsUpdated });
    }

    login = () => {
        const credentials = {
            username: this.state.controls.username.value,
            password: this.state.controls.password.value
        }
        this.props.login(credentials);
    }

    goToSignUp = () => {
        this.props.history.push('/signup');
    }

    render() {
        const formInputs = [];
        Object.keys(this.state.controls).forEach(key => {
            const input = this.state.controls[key];
            formInputs.push(<Input key={key} {...input} onChange={(event) => this.setControlValue(event, key)} />)
        });

        let form = (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-5">
                        {formInputs}
                        <div>
                            <button type="submit" className='btn btn-primary mr-4' onClick={this.login}>Login</button>
                            <button type="button" className='btn btn-primary' onClick={this.goToSignUp}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        );

        if (this.props.isAuthenticated) {
            form = <Redirect to='/' />
        }

        if (this.props.loading) {
            form = <Spinner />
        }
        return form;
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        loading: state.auth.loading
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        login: (credentials) => dispatch(actions.login(credentials))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(withRouter(Login));