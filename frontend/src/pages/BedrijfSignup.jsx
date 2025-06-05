import React from 'react';
import { useNavigate } from 'react-router-dom';

function BedrijfSignup() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verzamel alle formulierdata
    const data = {
      bedrijfsnaam: e.target.bedrijfsnaam.value,
      adres: e.target.adres.value,
      btw: e.target.btw.value,
      sector: e.target.sector.value,
      website: e.target.website.value,
      contactpersoon: e.target.contactpersoon.value,
      email: e.target.email.value,
      wachtwoord: e.target.wachtwoord.value,
      gsm: e.target.gsm.value
    };

    // Opslaan in localStorage
    localStorage.setItem('bedrijfAccount', JSON.stringify(data));

    // Navigeren naar login
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8">
      <h1 className="text-3xl font-bold text-center mb-10">Sign-Up Bedrijf</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white rounded-lg shadow p-10 grid md:grid-cols-2 gap-8"
      >
        {/* Linkerkant - Bedrijfsgegevens */}
        <div>
          <h2 className="text-lg font-semibold mb-4">BEDRIJFSGEGEVENS</h2>

          <div className="mb-4">
            <label className="block mb-1">Bedrijfsnaam</label>
            <input name="bedrijfsnaam" type="text" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Adres</label>
            <input name="adres" type="text" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">BTW-nummer</label>
            <input name="btw" type="text" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Sector</label>
            <input name="sector" type="text" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Website</label>
            <input name="website" type="url" className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
        </div>

        {/* Rechterkant - Contactpersoon */}
        <div>
          <h2 className="text-lg font-semibold mb-4">CONTACTPERSOON</h2>

          <div className="mb-4">
            <label className="block mb-1">Voornaam & Achternaam</label>
            <input name="contactpersoon" type="text" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">E-mailadres</label>
            <input name="email" type="email" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Wachtwoord</label>
            <input name="wachtwoord" type="password" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-6">
            <label className="block mb-1">GSM-nummer</label>
            <input
              name="gsm"
              type="tel"
              required
              pattern="[0-9]{4,15}"
              title="Gelieve een geldig telefoonnummer in te geven"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
            >
              Sign-Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BedrijfSignup;
