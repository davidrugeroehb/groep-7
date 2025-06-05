import React from 'react';
import logo from '../assets/team-placeholder.png';

function Login() {
  const [state, setState] = React.useState('Student');

  return (
    <form className='min-h-screen flex flex-col items-center justify-center text-black bg-gray-50 px-4'>
      <h1 className='text-2xl font-bold mb-6'>Welkom bij Career Match!</h1>

      <div className='bg-white p-10 rounded-lg shadow-md w-full max-w-md flex flex-col items-center gap-5'>
        {/* Logo */}
        <img src={logo} alt="EHB logo" className='h-20' />

        {/* Titel */}
        <h2 className='text-2xl font-semibold text-center'>{state} Login</h2>

        {/* Email */}
        <div className='w-full'>
          <label className='block mb-1 font-medium'>Email</label>
          <input
            type="email"
            required
            placeholder="jouw@email.com"
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
            className='border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
        </div>

        {/* Login knop */}
        <button
          type="submit"
          className='bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md transition'
        >
          Inloggen
        </button>

        {/* Wissel gebruikerstype */}
        {state === 'Admin' ? (
          <p className='text-sm'>
            Student login?{" "}
            <span
              onClick={() => setState('Student')}
              className='text-blue-500 underline cursor-pointer'
            >
              Klik hier
            </span>
          </p>
        ) : state === 'Student' ? (
          <p className='text-sm'>
            Bedrijf login?{" "}
            <span
              onClick={() => setState('Bedrijf')}
              className='text-blue-500 underline cursor-pointer'
            >
              Klik hier
            </span>
          </p>
        ) : (
          <p className='text-sm'>
            Admin login?{" "}
            <span
              onClick={() => setState('Admin')}
              className='text-blue-500 underline cursor-pointer'
            >
              Klik hier
            </span>
          </p>
        )}
      </div>

      {/* Sign-up call to action */}
      <div className='mt-6'>
        <p className='text-sm'>
          Nieuwe {state}?{" "}
          <button
            type="button"
            className='text-blue-600 font-medium underline hover:text-blue-800 transition cursor-pointer'
          >
            Registreer hier
          </button>
        </p>
      </div>
    </form>
  );
}

export default Login;
