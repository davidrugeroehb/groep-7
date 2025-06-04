import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/ehb.jpg';

const Navbar = () => {
  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'relative text-blue-600 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300'
      : 'relative text-black hover:text-blue-600 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300';

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
      {/* Logo + Titre à gauche */}
      <div className="flex items-center space-x-3">
        <img src={logo} alt="logo" className="h-10 w-auto" />
        <h1 className="text-xl font-bold">Career Match</h1>
      </div>

      {/* Liens centrés dans de juiste volgorde */}
      <ul className="flex space-x-6 text-sm font-medium justify-center flex-1">
        <li><NavLink to="/speeddates" className={navLinkClass}>Speeddates</NavLink></li>
        <li><NavLink to="/mijnaanvragen" className={navLinkClass}>Mijn Aanvragen</NavLink></li>
        <li><NavLink to="/mijnafspraken" className={navLinkClass}>Mijn Afspraken</NavLink></li>
        <li><NavLink to="/mijnprofiel" className={navLinkClass}>Mijn Profiel</NavLink></li>
        <li><NavLink to="/about" className={navLinkClass}>About</NavLink></li>
      </ul>

      {/* Login button à droite */}
      <div>
        <NavLink
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition duration-200 shadow-sm"
        >
          Login
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;