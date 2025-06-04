import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/ehb.jpg';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <img src={logo} alt="logo" className="h-12 w-auto" />
        <h1 className="text-xl font-bold">Groep 7</h1>
      </div>

      {/* Links */}
      <ul className="flex space-x-6 text-sm font-medium">
        <li><NavLink to="/about" className="hover:text-blue-600">About</NavLink></li>
        <li><NavLink to="/login" className="hover:text-blue-600">Login</NavLink></li>
        <li><NavLink to="/mijnaanvragen" className="hover:text-blue-600">Mijn Aanvragen</NavLink></li>
        <li><NavLink to="/mijnafspraken" className="hover:text-blue-600">Mijn Afspraken</NavLink></li>
        <li><NavLink to="/mijnprofiel" className="hover:text-blue-600">Mijn Profiel</NavLink></li>
        <li><NavLink to="/speeddates" className="hover:text-blue-600">Speeddates</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;