import React from 'react';
import { Redirect  } from 'react-router';
import { connect } from 'react-redux';

import Input from '../../../UI/Input/Input';
import Spinner from '../../../UI/Spinner/Spinner';
import * as actions from '../../../storage/actions/actions'

class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            controls: {
                email: {
                    id: 'email',
                    type: 'email',
                    label: 'Email',
                    value: null,
                    placeholder: 'Enter email'
                },
                username: {
                    id: 'username',
                    type: 'text',
                    label: 'Username',
                    value: null,
                    placeholder: 'Enter username'
                },
                password: {
                    id: 'password',
                    type: 'password',
                    label: 'Password',
                    value: null,
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

    signUp = () => {
        const user = {
            username: this.state.controls.username.value,
            email: this.state.controls.email.value,
            password: this.state.controls.password.value,
        }
        this.props.signUp(user);
    }

    render() {
        const formElemets = [];
        Object.keys(this.state.controls).forEach(key => {
            const input = this.state.controls[key];
            formElemets.push(<Input key={key} {...input} onChange={(event) => this.setControlValue(event, key)} />)
        });


        let form = (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-5">
                        {formElemets}
                        <div>
                            <button type="submit" className='btn btn-primary' onClick={this.signUp}>Sign Up</button>
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
        loading : state.auth.loading
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        signUp: (user) => dispatch(actions.signUp(user))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(SignUp);