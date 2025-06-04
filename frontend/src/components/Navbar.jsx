import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/ehb.jpg'; 

const Navbar = () => {
  return (
    <div className="navbar">
         <h1>Test Navbar</h1>
      <img src={logo} alt="logo" />
      <ul>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
        <li><NavLink to="/mijnaanvragen">Mijn Aanvragen</NavLink></li>
        <li><NavLink to="/mijnafspraken">Mijn Afspraken</NavLink></li>
        <li><NavLink to="/mijnprofiel">Mijn Profiel</NavLink></li>
        <li><NavLink to="/speeddates">Speeddates</NavLink></li>
      </ul>
    </div>
  );
};

export default Navbar;
