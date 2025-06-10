import React, { useEffect, useState } from "react";
 
function BedrijfsProfiel() {
  const [profiel, setProfiel] = useState(null);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchProfiel = async () => {
      try {
        const token = localStorage.getItem("bedrijfToken");

 
        const res = await fetch("http://localhost:4000/api/bedrijf/profiel", {
          headers: { Authorization: `Bearer ${token}` },
        });
 
        if (!res.ok) throw new Error("Profiel ophalen mislukt.");
 
        const data = await res.json();


        const res = await fetch("http://localhost:4000/api/bedrijf/profiel", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Profiel ophalen mislukt.");

        const data = await res.json();
        console.log("Gekregen profiel:", data); // handig voor debugging
        setProfiel(data);
      } catch (err) {
        console.error(err);
        setError("Fout bij ophalen van bedrijfsprofiel.");
      }
    };
 
    fetchProfiel();
  }, []);
 

    fetchProfiel();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Mijn Bedrijfsprofiel
        </h1>

 
        {error && <p className="text-red-600 text-center">{error}</p>}
 

        {error && <p className="text-red-600 text-center">{error}</p>}
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