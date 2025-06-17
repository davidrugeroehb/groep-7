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
    const token = localStorage.getItem('token');
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    try {
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            let errorData = { message: 'Onbekende fout' };
            try {
                errorData = await response.json();
            } catch (jsonErr) {
                console.warn(`Geen JSON response bij fout ${response.status} van ${url}`);
                errorData.message = `Netwerk- of serverfout: Status ${response.status}.`;
            }
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (err) {
        console.error("Fout in authenticatedFetch:", err);
        throw err;
    }
  };


  /* 1️⃣ ABOUT maar één keer ophalen  */
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setError(null);
        const data = await authenticatedFetch("http://localhost:4000/api/about");
        
        if (data && data.tekst_about !== undefined) {
            setTekst(data.tekst_about);
        } else {
            throw new Error("Ongeldig formaat voor 'About' data ontvangen van server.");
        }
      } catch (err) {
        console.error("Fout bij ophalen About:", err);
        setError("Fout bij het laden van de Over-pagina: " + err.message);
        setTekst("Career Match is een platform ontworpen ...");
      }
    };
    fetchAbout();
  }, []);


  /* 2️⃣ Profiel ophalen — check rol */
  useEffect(() => {
    const fetchProfiel = async () => {
      try {
        const adminId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');
        
        if (!adminId || role !== 'admin') {
            setError("Geen admin ID of rol gevonden. Log opnieuw in als admin.");
            setProfiel({ role: 'guest' });
            return;
        }

        const data = await authenticatedFetch(`http://localhost:4000/api/admin/mijnprofiel/${adminId}`);
        
        if (data && data.profile) {
            setProfiel(data.profile);
        } else {
            throw new Error("Ongeldig profiel data van server.");
        }

      } catch (err) {
        console.error("Fout bij ophalen profiel:", err);
        setProfiel({ role: localStorage.getItem("role") || "guest" });
        setError(`Fout bij ophalen van je profiel: ${err.message}`);
      }
    };
    fetchProfiel();
  }, []);


  /* 3️⃣ Bij opslaan PUT naar /api/about */
  const handleSave = async () => {
    try {
      const data = await authenticatedFetch("http://localhost:4000/api/about", {
        method: "PUT",
        body: JSON.stringify({ tekst }),
      });
      setTekst(data.tekst_about);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error("Fout bij opslaan:", err);
      setError("Fout bij opslaan van de tekst.");
    }
  };

  /* --------- UI VAN DE HOOFDCOMPONENT --------- */
  if (!profiel && !error)
    return <p className="text-center mt-10">Bezig met laden…</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-center mb-6">Over Career Match</h1>

        {/* Admin kan bewerken */}
        {profiel && profiel.role === "admin" && !isEditing && (
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
              <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
                Opslaan
              </button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-600 text-white px-4 py-2 rounded">
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

        {/* NIEUWE SECTIE: Admin aanmaken - DEZE IS VERWIJDERD EN VERPLAATST NAAR DASHBOARD.JSX */}
        {/*
        {profiel && profiel.role === "admin" && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Nieuwe Administrator Aanmaken</h2>
            <AdminRegistratieForm authenticatedFetch={authenticatedFetch} />
          </div>
        )}
        */}

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
} // Einde van de hoofdcomponent 'About'

// DE ADMINREGISTRATIEFORM COMPONENT IS VERWIJDERD UIT DIT BESTAND EN VERPLAATST NAAR DASHBOARD.JSX
/*
const AdminRegistratieForm = ({ authenticatedFetch }) => {
    // ... code ...
};
*/

export default About;