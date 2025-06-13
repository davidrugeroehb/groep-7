import React, { useEffect, useState } from 'react';

function MijnProfiel() {
  const [profiel, setProfiel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wijzig, setWijzig] = useState(false);
  const studentId = localStorage.getItem("userId");

  const [editableProfiel, setEditableProfiel] = useState({
    voornaam: '',
    achternaam: '',
    email: '',
    gsm: '',
    opleiding: '',
    specialisatie: '',
    talen: [],
    talenInput: '',
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
        setEditableProfiel({
          voornaam: data.profile.voornaam || '',
          achternaam: data.profile.achternaam || '',
          email: data.profile.email || '',
          gsm: data.profile.gsm || '',
          opleiding: data.profile.opleiding || '',
          specialisatie: data.profile.specialisatie || '',
          talen: Array.isArray(data.profile.talen) ? data.profile.talen : [],
          talenInput: Array.isArray(data.profile.talen) ? data.profile.talen.join(', ') : '',
        });
      } catch (err) {
        console.error("Fout bij ophalen van je profiel:", err);
        setError("Fout bij ophalen van je profiel.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiel();
  }, [studentId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "talenInput") {
      setEditableProfiel((prev) => ({
        ...prev,
        talenInput: value,
        talen: value.split(',').map(t => t.trim()).filter(t => t !== '')
      }));
    } else {
      setEditableProfiel((prev) => ({ ...prev, [name]: value }));
    }
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
        body: JSON.stringify({
          ...editableProfiel,
          talenInput: undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Opslaan mislukt");
      }

      alert(data.message);
      setProfiel(data.profile);
      setWijzig(false);
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
                  disabled
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
                <label className="block text-gray-700 text-sm font-bold mb-1 mt-2">Talen:</label>
                <input
                  type="text"
                  name="talenInput"
                  value={editableProfiel.talenInput}
                  onChange={handleEditChange}
                  className={inputStyle}
                />
              </>
            ) : (
              <>
                <p><strong>Opleiding:</strong> {profiel.opleiding}</p>
                <p><strong>Specialisatie:</strong> {profiel.specialisatie || 'N.v.t.'}</p>
                <p><strong>Talen:</strong> {(profiel.talen && profiel.talen.length > 0) ? profiel.talen.join(', ') : 'N.v.t.'}</p>
              </>
            )}
          </div>

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
