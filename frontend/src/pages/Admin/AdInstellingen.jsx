import React, { useEffect, useState } from "react";
import teamImage from "../../assets/team-placeholder.png";

function About() {
  const [profiel, setProfiel]   = useState(null);
  const [error,   setError]     = useState(null);
  const [tekst,   setTekst]     = useState(
    "Career Match is een platform ontworpen ..."
  );
  const [isEditing, setIsEditing] = useState(false);

  // Hulpfunctie voor geauthenticeerde fetches
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token'); // Gebruik 'token', niet 'adminToken'
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Voeg de token toe
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Netwerk- of serverfout.' }));
      console.error(`API Fout (${url}):`, response.status, errorData);
      if (response.status === 401 || response.status === 403) {
        alert("Je sessie is verlopen of niet toegestaan. Gelieve opnieuw in te loggen.");
        // window.location.href = '/login'; // Of useNavigate
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  };


  /* 1️⃣ ABOUT maar één keer ophalen  */
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res  = await authenticatedFetch("http://localhost:4000/api/about"); // Gebruik authenticatedFetch
        const data = await res.json(); // Dit is al gebeurd in authenticatedFetch, dus dit is overbodig
        setTekst(data.tekst_about);
      } catch (err) { // Vang de fout correct op
        console.error("Fout bij ophalen About:", err);
        setError("Fout bij het laden van de Over-pagina."); // Zet een foutmelding
      }
    };
    fetchAbout();
  }, []);

  /* 2️⃣ Profiel ophalen — check rol */
  useEffect(() => {
    const fetchProfiel = async () => {
      try {
        // Haal de admin ID op uit localStorage (ingelogde gebruiker)
        const adminId = localStorage.getItem('userId');
        if (!adminId) {
            setError("Geen admin ID gevonden. Log opnieuw in.");
            setProfiel({ role: localStorage.getItem("role") || "guest" });
            return;
        }

        // **** AANPASSING HIER: Correcte route en ID ****
        const data = await authenticatedFetch(`http://localhost:4000/api/admin/mijnprofiel/${adminId}`); // Gebruik de correcte route met ID

        setProfiel(data.profile);       // De API retourneert { profile: {...}, role: "admin" }
      } catch (err) {
        console.error("Fout bij ophalen profiel:", err);
        setProfiel({ role: localStorage.getItem("role") || "guest" });
        setError("Fout bij ophalen van je profiel.");
      }
    };
    fetchProfiel();
  }, []); // [] betekent eenmalig laden

  /* 3️⃣ Bij opslaan PUT naar /api/about */
  const handleSave = async () => {
    try {
      // Gebruik authenticatedFetch voor PUT
      const data = await authenticatedFetch("http://localhost:4000/api/about", {
        method: "PUT",
        body: JSON.stringify({ tekst }),
      });
      setTekst(data.tekst_about);
      setIsEditing(false);
    } catch (err) {
      console.error("Fout bij opslaan:", err); // Log de fout
      setError("Fout bij opslaan van de tekst."); // Zet een foutmelding
    }
  };

  /* --------- UI --------- */
  if (!profiel)
    return <p className="text-center mt-10">Bezig met laden…</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-center mb-6">Over Career Match</h1>

        {/* Admin kan bewerken */}
        {profiel.role === "admin" && !isEditing && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Bewerken
            </button>
          </div>
        )}

        {/* Tekst of textarea */}
        {isEditing ? (
          <>
            <textarea
              value={tekst}
              onChange={(e) => setTekst(e.target.value)}
              rows={6}
              className="w-full border p-2 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-1 rounded">
                Opslaan
              </button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-600 text-white px-4 py-1 rounded">
                Annuleren
              </button>
            </div>
          </>
        ) : (
          <p className="mb-6 leading-relaxed">{tekst}</p>
        )}

        {/* Foutmelding weergeven */}
        {error && <p className="text-center text-red-600 mb-6">{error}</p>}

        {/* Team-afbeelding */}
        <div className="text-center mb-8">
          <img src={teamImage} alt="Team" className="inline-block max-h-64 rounded shadow" />
        </div>

        {/* Contact */}
        <h2 className="text-2xl font-semibold mb-2">Contact</h2>
        <ul className="space-y-1">
          <li>📧 info@careerlaunch.be</li>
          <li>📞 +32 470 00 00 00</li>
          <li>📍 Nijverheidskaai 170, 1070 Brussel</li>
        </ul>
      </div>
    </div>
  );
}

export default About;