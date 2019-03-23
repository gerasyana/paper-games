import React from 'react';
import { NavLink } from 'react-router-dom';
import NavigationItems from './NavigationItems/NavigationItems';

const navigationBar = (props) => (
  <div className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
    <div className="container">
      <NavLink to='/' className="navbar-brand">Paper Games Online</NavLink>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarResponsive">
        <NavigationItems {...props} />
      </div>
    </div>
  </div>
);

export default navigationBar;