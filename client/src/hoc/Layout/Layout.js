import React, { Component } from 'react';

import Aux from '../Aux/Aux';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

class Layout extends Component {
    render() {
        return (<Aux>
            <NavigationBar />
            {this.props.children}
        </Aux>)
    }
}

export default Layout;