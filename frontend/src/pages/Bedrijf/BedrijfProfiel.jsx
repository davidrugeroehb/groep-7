import React, { useEffect, useState } from "react";

function BedrijfsProfiel() {
  const [profiel, setProfiel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchProfiel = async () => {
        const role = localStorage.getItem("role");
        if (role !== "bedrijf") {
          setError("Besrijf niet gevonden.");
          return;
        }
  
        try {
          const res = await fetch("http://localhost:4000/api/bedrijf/bedrijfprofiel");
  
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

  const inputStyle = 'bg-white border border-gray-300 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all';
  
  const [wijzig, setWijzig] = useState(false);
  

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Mijn Bedrijfsprofiel
        </h1>

      

        {profiel ? (
          <div className="space-y-4 text-gray-700">
            <p><strong>Naam:</strong> {profiel.name}</p>
            <p><strong>Email:</strong> {profiel.email}</p>
            <p><strong>Contactpersoon:</strong> {profiel.contactpersoon}</p>
            <p><strong>Adres:</strong> {profiel.adres}</p>
            <p><strong>Website:</strong> {profiel.website}</p>
            <p><strong>Sector:</strong> {profiel.sector}</p>
            <p><strong>BTW-nummer:</strong> {profiel.btwNummer}</p>
            <p><strong>Telefoon:</strong> {profiel.phone}</p>
          </div>
        ) : (
          !error && <p className="text-center text-gray-500">Profiel wordt geladen...</p>
        )}
      </div>
    </div>
  );
}

export default BedrijfsProfiel;
