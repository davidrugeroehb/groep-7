import React from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsJustify } from 'react-icons/bs'; // Verwijder BsPersonCircle
import { IoLogOutOutline } from "react-icons/io5"; // Importeer het logout-icoon
import { useNavigate } from 'react-router-dom'; // Voor redirect na uitloggen
import logo from '../../assets/fotoehb.png';

function Header({onMenuClick}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Verwijder JWT-token en rol uit localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Indien je de gebruikers-ID opslaat
    localStorage.removeItem('role');
    // Redirect naar de loginpagina
    navigate('/login');
  };

  return (
      <header className='flex justify-between items-center bg-white p-4 shadow-md'>
        <div className='cursor-pointer' onClick={onMenuClick}>
          <BsJustify className='text-xl' />
        </div>
        <div className="flex justify-center flex-1">
          <img src={logo} alt="Logo" className="h-10 object-contain" />
        </div>
        <div className='header-right flex items-center space-x-4'>
          <BsFillBellFill className='text-xl cursor-pointer'/> {/* Maak de iconen aanklikbaar indien nodig */}
          <BsFillEnvelopeFill className='text-xl cursor-pointer'/>
          {/* Uitlogknop */}
          <button
            onClick={handleLogout}
            className="flex items-center text-red-600 hover:text-red-800 font-semibold py-1 px-3 rounded transition-colors duration-200"
            title="Uitloggen"
          >
            <IoLogOutOutline className="text-2xl mr-1" />
            <span>Logout</span>
          </button>
        </div>
      </header>
  );
}

export default Header;