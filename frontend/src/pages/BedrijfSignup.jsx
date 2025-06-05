import React from 'react';
import { useNavigate } from 'react-router-dom';

function BedrijfSignup() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <input type="text" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Adres</label>
            <input type="text" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">BTW-nummer</label>
            <input type="text" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Sector</label>
            <input type="text" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Website</label>
            <input type="url" className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
        </div>

        {/* Rechterkant - Contactpersoon */}
        <div>
          <h2 className="text-lg font-semibold mb-4">CONTACTPERSOON</h2>

          <div className="mb-4">
            <label className="block mb-1">Voornaam & Achternaam</label>
            <input type="text" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">E-mailadres</label>
            <input type="email" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Wachtwoord</label>
            <input type="password" required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="mb-6">
            <label className="block mb-1">GSM-nummer</label>
            <div className="flex gap-2">
              <select
                required
                className="border border-gray-300 rounded px-3 py-2 bg-white text-sm"
                defaultValue="+32"
              >
                <option value="+32">+32</option>
                <option value="+31">+31</option>
                <option value="+33">+33</option>
                <option value="+49">+49</option>
              </select>
              <input
                type="tel"
                required
                pattern="[0-9]{6,15}"
                title="Geef een geldig telefoonnummer in zonder landcode"
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                placeholder="470000000"
              />
            </div>
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