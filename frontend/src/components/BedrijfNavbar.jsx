import React, {useState} from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/ehb.jpg';

const BedrijfNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
      {/* Hamburger button (alleen op mobiel zichtbaar) */}
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="md:hidden text-gray-700 ml-auto"
    aria-label="Toggle menu"
  >
    ☰
  </button>

      {/* Links */}
      <ul className="hidden md:flex space-x-6 text-sm font-medium justify-center flex-1">
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
          className="hidden md:flex bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition duration-200 shadow-sm"
        >
          Logout
        </button>
      </div>
      {menuOpen && (
  <div className="absolute top-16 left-0 w-full bg-white border-t z-50 shadow-md md:hidden">
    <ul className="flex flex-col p-4 space-y-2 text-sm font-medium">
      <li><NavLink to="/bedrijf-home" className={navLinkClass}>Geplande Speeddates</NavLink></li>
      <li><NavLink to="/aanmaken" className={navLinkClass}>Aanmaken</NavLink></li>
      <li><NavLink to="/bedrijf-aanvragen" className={navLinkClass}>Aanvragen</NavLink></li>
      <li><NavLink to="/bedrijf-profiel" className={navLinkClass}>Profiel</NavLink></li>
      <li><NavLink to="/studenten-zoeken" className={navLinkClass}>Studenten zoeken</NavLink></li>
      <li><NavLink to="/about" className={navLinkClass}>About</NavLink></li>
      <li>
        <button
          onClick={handleLogout}
          className="w-full text-left bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded transition"
        >
          Logout
        </button>
      </li>
    </ul>
  </div>
)}

    </nav>
  );
};

export default BedrijfNavbar;
