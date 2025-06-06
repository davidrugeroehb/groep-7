

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/fotoehb.png';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:4000/api/bedrijf/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('bedrijfToken', data.token);
        alert(`Welkom, ${data.name}!`);
        navigate('/mijnprofiel'); // verander naar gewenste route als nodig
      } else {
        alert(data.message || 'Login mislukt');
      }
    } catch (err) {
      console.error(err);
      alert('Serverfout bij login');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='min-h-screen flex flex-col items-center justify-center text-black bg-gray-50 px-4'
    >
      <h1 className='text-2xl font-bold mb-6'>Welkom bij Career Match!</h1>

      <div className='bg-white p-10 rounded-lg shadow-md w-full max-w-md flex flex-col items-center gap-5'>
        {/* Logo */}
        <img src={logo} alt="EHB logo" className='h-20' />

        {/* Titel */}
        <h2 className='text-2xl font-semibold text-center'>Login</h2>

        {/* Email */}
        <div className='w-full'>
          <label className='block mb-1 font-medium'>Email</label>
          <input
            type="email"
            required
            placeholder="jouw@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
        </div>

        {/* Wachtwoord */}
        <div className='w-full'>
          <label className='block mb-1 font-medium'>Wachtwoord</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
          />


        </div>
      <div className='flex items-center'>
        <p>Nieuwe {state}?</p>
        <button className='bg-primary bg-blue-500 text-black w-full py-2 rounded-md text-base'>Sign-up</button>
      </div>
    </form>
  )

}

export default Login;