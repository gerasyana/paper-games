import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router';
import { connect } from 'react-redux'

import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';
import * as actions from '../../../storage/actions/actions'
import { validateInput } from '../../../helpers/validation';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            controls: {
                username: {
                    type: 'text',
                    label: 'Username',
                    errorMessage: '',
                    value: '',
                    placeholder: 'Username'
                },
                password: {
                    type: 'password',
                    label: 'Password',
                    errorMessage: '',
                    value: '',
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

    setControlValue = (event) => {
        const key = event.target.id;
        const value = event.target.value;
        const validationResults = validateInput(value, this.state.validation[key]);
        const control = {
            ...this.state.controls[key],
            ...validationResults,
            value
        };
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
            formInputs.push(<Input key={key} id={key} {...input} onChange={this.setControlValue} />)
        });

        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <div className="alert alert-dismissible alert-secondary">
                    <strong>{this.props.error}</strong>
                </div>
            );
        }

        let form = (
            <div className="container body-container">
                <div className="row justify-content-center">
                    <div className="col-4">
                        {errorMessage}
                        {formInputs}
                        <div>
                            <Button
                                type="submit"
                                className='btn btn-primary mr-4 mb-4'
                                disabled={!this.state.loginButtonEnabled}
                                onClick={this.login} >
                                Login
                            </Button>
                            <Button
                                type="button"
                                className='btn btn-primary mb-4'
                                onClick={this.goToSignUp}>
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );

        if (this.props.isAuthenticated) {
            form = <Redirect to={this.props.redirectUrl} />
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
        loading: state.auth.loading,
        error: state.auth.error,
        redirectUrl: state.auth.redirectUrl
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        login: (credentials) => dispatch(actions.login(credentials))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(withRouter(Login));