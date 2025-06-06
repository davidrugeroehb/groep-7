import React, { useEffect, useState } from 'react';

function MijnProfiel() {
  const [profiel, setProfiel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiel = async () => {
      const role = localStorage.getItem("role");
      if (role !== "student") {
        setError("Je bent niet ingelogd als student.");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/student/mijnprofiel");

        if (!res.ok) {
          throw new Error("Profiel ophalen mislukt.");
        }

        const data = await res.json();
        setProfiel(data);
      } catch (err) {
        console.error(err);
        setError("Fout bij ophalen van je profiel.");
      }
    };

    fetchProfiel();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!profiel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Profiel wordt geladen...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Mijn Profiel</h1>

        <div className="space-y-6 text-gray-700">
          {/* Accountgegevens */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Accountgegevens:</h2>
            <p><strong>Voornaam:</strong> {profiel.voornaam}</p>
            <p><strong>Achternaam:</strong> {profiel.achternaam}</p>
            <p><strong>E-mail:</strong> {profiel.email}</p>
            <p><strong>GSM nr:</strong> {profiel.gsm}</p>
          </div>

          {/* Academiegegevens */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Academiegegevens:</h2>
            <p><strong>Opleiding:</strong> {profiel.opleiding}</p>
            <p><strong>Specialisatie:</strong> {profiel.specialisatie}</p>
            <p><strong>Taal:</strong> {profiel.talen}</p>
          </div>

          {/* Bewerken-knop */}
          <div className="text-right mt-4">
            <button className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition">
              Profiel Bewerken
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MijnProfiel;
