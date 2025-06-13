import React, { useEffect, useState } from "react";
import teamImage from "../../assets/team-placeholder.png";

function About() {
  const [profiel, setProfiel]   = useState(null);
  const [error,   setError]     = useState(null);
  const [tekst,   setTekst]     = useState(
    "Career Match is een platform ontworpen ..."
  );
  const [isEditing, setIsEditing] = useState(false);

  /* 1️⃣ ABOUT maar één keer ophalen  */
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res  = await fetch("http://localhost:4000/api/about");
        const data = await res.json();
        setTekst(data.tekst_about);
      } catch {
        console.error("Fout bij ophalen About");
      }
    };
    fetchAbout();
  }, []);                       //  ← dependency-array toegevoegd

  /* 2️⃣ Profiel ophalen — check rol */
  useEffect(() => {
    const fetchProfiel = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/admin/mijnprofiel", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProfiel(data);       // ➜ { role: "admin", ... }
      } catch (err) {
        console.error(err);
        // fallback zodat de pagina tóch werkt
        setProfiel({ role: localStorage.getItem("role") || "guest" });
        setError("Fout bij ophalen van je profiel.");
      }
    };
    fetchProfiel();
  }, []);

  /* 3️⃣ Bij opslaan PUT naar /api/about */
  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tekst }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTekst(data.tekst_about);
      setIsEditing(false);
    } catch (err) {
      console.error("Fout bij opslaan");
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