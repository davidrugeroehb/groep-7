import React, { useEffect, useState } from 'react';

function MijnProfiel() {
  const [profiel, setProfiel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wijzig, setWijzig] = useState(false); // State om bewerk-modus te togglen
  const studentId = localStorage.getItem("userId"); // Haal student ID op

  // State voor bewerkbare velden
  const [editableProfiel, setEditableProfiel] = useState({
    voornaam: '',
    achternaam: '',
    email: '',
    gsm: '',
    opleiding: '',
    specialisatie: '',
    taal: '', // of talen: [] als het een array is
  });

  useEffect(() => {
    const fetchProfiel = async () => {
      const role = localStorage.getItem("role");
      if (role !== "student" || !studentId) {
        setError("Je bent niet ingelogd als student of student ID ontbreekt.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:4000/api/student/mijnprofiel/${studentId}`);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Profiel ophalen mislukt.");
        }

        const data = await res.json();
        setProfiel(data.profile);
        // Initialiseer editableProfiel met de opgehaalde data
        setEditableProfiel({
          voornaam: data.profile.voornaam || '',
          achternaam: data.profile.achternaam || '',
          email: data.profile.email || '',
          gsm: data.profile.gsm || '',
          opleiding: data.profile.opleiding || '',
          specialisatie: data.profile.specialisatie || '',
          taal: data.profile.taal || '',
        });
      } catch (err) {
        console.error("Fout bij ophalen van je profiel:", err);
        setError("Fout bij ophalen van je profiel.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiel();
  }, [studentId]); // Herlaad bij wijziging van studentId

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableProfiel((prev) => ({ ...prev, [name]: value }));
  };

  const OpslaanBewerk = async () => {
    if (!studentId) {
      alert("Student ID ontbreekt. Kan profiel niet opslaan.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/api/student/mijnprofiel/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableProfiel), // Stuur de bewerkbare data
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Opslaan mislukt");
      }

      alert(data.message); // Toon succesbericht
      setProfiel(data.profile); // Update hoofdprofiel state met de bijgewerkte data
      setWijzig(false); // Verlaat de bewerk-modus
    } catch (err) {
      console.error("Fout bij opslaan van profiel:", err);
      alert(`Fout bij opslaan van profiel: ${err.message || "Onbekende fout"}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Profiel wordt geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const inputStyle = 'bg-white border border-gray-300 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Mijn Profiel</h1>

        <div className="space-y-6 text-gray-700">
          {/* Accountgegevens */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Accountgegevens:</h2>
            {wijzig ? (
              <>
                <label className="block text-gray-700 text-sm font-bold mb-1">Voornaam:</label>
                <input
                  type="text"
                  name="voornaam"
                  value={editableProfiel.voornaam}
                  onChange={handleEditChange}
                  className={inputStyle}
                />
                <label className="block text-gray-700 text-sm font-bold mb-1 mt-2">Achternaam:</label>
                <input
                  type="text"
                  name="achternaam"
                  value={editableProfiel.achternaam}
                  onChange={handleEditChange}
                  className={inputStyle}
                />
                <label className="block text-gray-700 text-sm font-bold mb-1 mt-2">E-mail:</label>
                <input
                  type="email"
                  name="email"
                  value={editableProfiel.email}
                  onChange={handleEditChange}
                  className={inputStyle}
                  disabled // E-mail vaak niet direct bewerkbaar zonder extra verificatie
                />
                <label className="block text-gray-700 text-sm font-bold mb-1 mt-2">GSM nr:</label>
                <input
                  type="text"
                  name="gsm"
                  value={editableProfiel.gsm}
                  onChange={handleEditChange}
                  className={inputStyle}
                />
              </>
            ) : (
              <>
                <p><strong>Voornaam:</strong> {profiel.voornaam}</p>
                <p><strong>Achternaam:</strong> {profiel.achternaam}</p>
                <p><strong>E-mail:</strong> {profiel.email}</p>
                <p><strong>GSM nr:</strong> {profiel.gsm || 'N.v.t.'}</p>
              </>
            )}
          </div>

          {/* Academiegegevens */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Academiegegevens:</h2>
            {wijzig ? (
              <>
                <label className="block text-gray-700 text-sm font-bold mb-1">Opleiding:</label>
                <input
                  type="text"
                  name="opleiding"
                  value={editableProfiel.opleiding}
                  onChange={handleEditChange}
                  className={inputStyle}
                />
                <label className="block text-gray-700 text-sm font-bold mb-1 mt-2">Specialisatie:</label>
                <input
                  type="text"
                  name="specialisatie"
                  value={editableProfiel.specialisatie}
                  onChange={handleEditChange}
                  className={inputStyle}
                />
                <label className="block text-gray-700 text-sm font-bold mb-1 mt-2">Taal:</label>
                <input
                  type="text"
                  name="taal"
                  value={editableProfiel.taal}
                  onChange={handleEditChange}
                  className={inputStyle}
                />
                {/* Als 'talen' een array is, moet je hier een checkbox/multi-select implementeren */}
              </>
            ) : (
              <>
                <p><strong>Opleiding:</strong> {profiel.opleiding}</p>
                <p><strong>Specialisatie:</strong> {profiel.specialisatie || 'N.v.t.'}</p>
                <p><strong>Taal:</strong> {profiel.taal || 'N.v.t.'}</p>
              </>
            )}
          </div>

          {/* Bewerken/Opslaan/Annuleren knoppen */}
          <div className="text-right mt-4">
            {wijzig ? (
              <div className="flex justify-end gap-2">
                <button
                  onClick={OpslaanBewerk}
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
                >
                  Opslaan
                </button>
                <button
                  onClick={() => setWijzig(false)}
                  className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition"
                >
                  Annuleren
                </button>
              </div>
            ) : (
              <button
                onClick={() => setWijzig(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
              >
                Profiel Bewerken
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MijnProfiel;
