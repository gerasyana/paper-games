import React from 'react';
import { Redirect, withRouter } from 'react-router';
import { connect } from 'react-redux'

import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
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
                    errorMessage: null,
                    placeholder: 'Username'
                },
                password: {
                    id: 'password',
                    type: 'password',
                    label: 'Password',
                    errorMessage: null,
                    placeholder: 'Enter password'
                }
            },
            validation: {
                username: {
                    required: true,
                    minLength: 5,
                    maxLength: 15
                },
                password: {
                    required: true,
                    minLength: 5,
                    maxLength: 20
                }
            },
            loginButtonEnabled: false
        }
    }

    setControlValue = (event, key) => {
        const value = event.target.value;
        const validationResults = validateInput(value, this.state.validation[key]);
        const control = {
            ...this.state.controls[key],
            ...validationResults,
            value,
        }
        const controls = {
            ...this.state.controls,
            [key]: control
        }
        this.setState({
            controls,
            loginButtonEnabled: this.isButtonEnabled(controls)
        });
    }

    isButtonEnabled = (controls) => {
        const validControls = Object.keys(controls).filter(key => {
            const control = controls[key];
            return Object.hasOwnProperty.call(control, 'isValid') && control.isValid
        });
        return Object.keys(controls).length === validControls.length;
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
            formInputs.push(<Input
                key={key}
                {...input}
                onChange={(event) => this.setControlValue(event, key)}
            />)
        });

        let form = (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-5">
                        {formInputs}
                        <div>
                            <Button
                                type="submit"
                                className='btn btn-primary mr-4'
                                disabled={!this.state.loginButtonEnabled}
                                onClick={this.login} >
                                Login
                            </Button>
                            <Button
                                type="button"
                                className='btn btn-primary'
                                onClick={this.goToSignUp}>
                                Sign Up
                            </Button>
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