import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';
import * as actions from '../../../storage/actions/actions'
import { validateInput } from '../../../helpers/validation';

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            controls: {
                username: {
                    id: 'username',
                    type: 'text',
                    label: 'Username',
                    value: '',
                    placeholder: 'Enter username'
                },
                password: {
                    id: 'password',
                    type: 'password',
                    label: 'New password',
                    value: '',
                    placeholder: 'Enter new password'
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
            buttonEnabled: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.loading !== nextProps.loading ||
            this.props.error !== nextProps.error ||
            this.state.controls !== nextState.controls;
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
            buttonEnabled: this.isButtonEnabled(controls)
        });
    }

    isButtonEnabled = (controls) => {
        const validControls = Object.keys(controls).filter(key => {
            const control = controls[key];
            return Object.hasOwnProperty.call(control, 'isValid') && control.isValid
        });
        return Object.keys(controls).length === validControls.length;
    }

    resetPassword = () => {
        const data = {
            username: this.state.controls.username.value,
            password: this.state.controls.password.value
        }
        this.props.resetPassword(data);
    }

    render() {
        const formElements = Object.keys(this.state.controls).map(key => {
            const input = this.state.controls[key];
            return <Input key={key}{...input} onChange={this.setControlValue} />;
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
            <div className="body-container container">
                <div className="row justify-content-center">
                    <div className="col-sm-4 col-margin-fixed">
                        {errorMessage}
                        {formElements}
                        <div>
                            <Button
                                type="submit"
                                className='btn btn-primary'
                                onClick={this.resetPassword}
                                disabled={!this.state.buttonEnabled}>
                                Reset password
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
        loading: state.auth.loading,
        error: state.auth.error
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        resetPassword: (user) => dispatch(actions.resetPassword(user))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(ForgotPassword);