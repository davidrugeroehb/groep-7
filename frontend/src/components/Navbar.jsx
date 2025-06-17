import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import React, {useState} from 'react';
import logo from '../assets/ehb.jpg';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);


  const hiddenRoutes = ['/bedrijf/signup', '/login'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const isLoggedIn =
    localStorage.getItem("role") || localStorage.getItem("bedrijfToken");

  const handleLogout = () => {
    localStorage.clear(); // verwijdert alles
    navigate("/login");
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
        <Link to="/speeddates" className="text-xl font-bold">Career Match</Link>
      </div>
      {/* Hamburger button (alleen zichtbaar op mobiel) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-gray-700"
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Navigatielinks */}
      <ul className="hidden md:flex space-x-6 text-sm font-medium justify-center flex-1">
        <li><NavLink to="/speeddates" className={navLinkClass}>Speeddates</NavLink></li>
        <li><NavLink to="/mijnaanvragen" className={navLinkClass}>Mijn Aanvragen</NavLink></li>
        <li><NavLink to="/mijnafspraken" className={navLinkClass}>Mijn Afspraken</NavLink></li>
        <li><NavLink to="/mijnprofiel" className={navLinkClass}>Mijn Profiel</NavLink></li>
        <li><NavLink to="/about" className={navLinkClass}>About</NavLink></li>
      </ul>

      {/* Rechts: Login of Logout */}
      <div>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition duration-200 shadow-sm"
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition duration-200 shadow-sm"
          >
            Login
          </NavLink>
        )}
      </div>
      {menuOpen && (
  <div className="absolute top-16 left-0 w-full bg-white border-t z-50 shadow-md md:hidden">
    <ul className="flex flex-col p-4 space-y-2 text-sm font-medium">
      <li><NavLink to="/speeddates" className={navLinkClass}>Speeddates</NavLink></li>
      <li><NavLink to="/mijnaanvragen" className={navLinkClass}>Mijn Aanvragen</NavLink></li>
      <li><NavLink to="/mijnafspraken" className={navLinkClass}>Mijn Afspraken</NavLink></li>
      <li><NavLink to="/mijnprofiel" className={navLinkClass}>Mijn Profiel</NavLink></li>
      <li><NavLink to="/about" className={navLinkClass}>About</NavLink></li>
      
    </ul>
  </div>
)}
    </nav>
  );
};

export default Navbar;
