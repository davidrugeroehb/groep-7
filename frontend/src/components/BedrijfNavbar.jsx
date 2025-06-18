import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/ehb.jpg';

const BedrijfNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Verberg navbar op login of signup pagina
  const hiddenRoutes = ['/login', '/bedrijf/signup'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'relative text-blue-600 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300'
      : 'relative text-black hover:text-blue-600 after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all after:duration-300';

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
      {/* Logo + Titel */}
      <div className="flex items-center space-x-3">
        <img src={logo} alt="logo" className="h-10 w-auto" />
        <NavLink to="/bedrijf-home" className="text-xl font-bold">
          Career Match
        </NavLink>
      </div>

      {/* Links */}
      <ul className="flex space-x-6 text-sm font-medium justify-center flex-1">
        <li>
          <NavLink to="/bedrijf-home" className={navLinkClass}>
            Geplande Speeddates
          </NavLink>
        </li>
        <li>
          <NavLink to="/aanmaken" className={navLinkClass}>
            Aanmaken
          </NavLink>
        </li>
        <li>
          <NavLink to="/bedrijf-aanvragen" className={navLinkClass}>
            Aanvragen
          </NavLink>
        </li>
        <li>
          <NavLink to="/bedrijf-profiel" className={navLinkClass}>
            Profiel
          </NavLink>
        </li>
        <li>
          <NavLink to="/studenten-zoeken" className={navLinkClass}>
            Studenten zoeken
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </li>
      </ul>

      {/* Logout */}
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition duration-200 shadow-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default BedrijfNavbar;