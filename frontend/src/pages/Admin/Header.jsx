import React, { useState, useEffect } from 'react'; // Voeg useState en useEffect toe
import { BsFillBellFill, BsFillEnvelopeFill, BsJustify } from 'react-icons/bs';
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/fotoehb.png';

function Header({onMenuClick}) {
  const navigate = useNavigate();
  const [pendingRegistrationsCount, setPendingRegistrationsCount] = useState(0);

  // Hulpfunctie om API-requests te doen met authenticatie (kopie uit Dashboard/Bedrijvenbeheer)
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    try {
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            let errorData = { message: 'Onbekende fout' };
            try {
                errorData = await response.json();
            } catch (jsonErr) {
                console.warn(`Geen JSON response bij fout ${response.status} van ${url}`);
                errorData.message = `Netwerk- of serverfout: Status ${response.status}.`;
            }
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (err) {
        console.error("Fout in authenticatedFetch:", err);
        throw err;
    }
  };

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        // Haal de telling van afwachtende bedrijfsregistraties op
        const data = await authenticatedFetch("http://localhost:4000/api/bedrijven/pending-registrations/count");
        setPendingRegistrationsCount(data.count);
      } catch (error) {
        console.error("Fout bij ophalen aantal pending registraties:", error);
        setPendingRegistrationsCount(0); // Zet op 0 bij fout
      }
    };

    fetchPendingCount();
    // Optioneel: refresh de count elke X seconden of bij een event
    const interval = setInterval(fetchPendingCount, 60000); // Elke minuut updaten
    return () => clearInterval(interval); // Cleanup bij unmount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleBellClick = () => {
    if (pendingRegistrationsCount > 0) {
      navigate('/admin/bedrijvenbeheer?tab=aanvragen'); // Ga naar de bedrijvenbeheer pagina en open de 'aanvragen' tab
    } else {
      alert("Er zijn momenteel geen nieuwe bedrijfsregistraties in afwachting van goedkeuring.");
    }
  };

  return (
    <header className='relative flex justify-between items-center bg-white p-4 shadow-md'>
      <div className='cursor-pointer' onClick={onMenuClick}>
        <BsJustify className='text-2xl' />
      </div>
  
      {/* Logo exact gecentreerd */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img 
          src={logo} 
          alt="School Logo" 
          className="h-16 object-contain" 
          style={{ maxWidth: '200px' }} 
        />
      </div>
  
      <div className='header-right flex items-center space-x-4'>
        <div className="relative cursor-pointer" onClick={handleBellClick}>
          <BsFillBellFill className='text-2xl' />
          {pendingRegistrationsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {pendingRegistrationsCount}
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center text-red-600 hover:text-red-800 font-semibold py-2 px-4 rounded transition-colors duration-200"
          title="Déconnexion"
        >
          <IoLogOutOutline className="text-2xl mr-2" />
          <span className="text-base">Logout</span>
        </button>
      </div>
    </header>
  );
  
}

export default Header;