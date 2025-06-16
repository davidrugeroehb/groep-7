import React, { useEffect, useState } from "react";
import './StudentenBeheer.css';

function StudentenBeheer() {
  const [studenten, setStudenten] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  // Hulpfunctie voor geauthenticeerde fetches
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token'); // Haal de token op
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


  const verwijderStudent = (id) => {
    // Implementeer hier de API call om student te verwijderen
    // Voorbeeld:
    // try {
    //   await authenticatedFetch(`http://localhost:4000/api/students/${id}`, { method: 'DELETE' });
    //   setStudenten((prev) => prev.filter((s) => s._id !== id));
    //   alert("Student succesvol verwijderd!");
    // } catch (err) {
    //   console.error("Fout bij verwijderen student:", err);
    //   alert("Fout bij verwijderen student.");
    // }
    setStudenten((prev) => prev.filter((s) => s._id !== id)); // Tijdelijk: verwijdert alleen uit de UI
    alert("Verwijderen van student (functionaliteit in backend nog toe te voegen).");

  };

  useEffect(() => {
    const fetchStudenten = async () => {
      try {
        // **** AANPASSING HIER: Gebruik de correcte route /api/students ****
        const data = await authenticatedFetch("http://localhost:4000/api/students"); // Haal alle studenten op

        setStudenten(data);
      } catch (err) {
        console.error(err);
        setError("Kan studenten niet ophalen.");
      }
    };
    fetchStudenten();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8 border">
        <h1 className="text-3xl font-bold text-center mb-8">Studenten beheren</h1>

        {error && <p className="text-center text-red-600 mb-6">{error}</p>}

        {studenten.length === 0 && !error ? (
          <p className="text-center text-gray-500">Er zijn momenteel geen studenten beschikbaar.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {studenten.map((s) => (
              <div key={s._id} className="bg-gray-100 p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-1">
                  {s.voornaam} {s.achternaam}
                </h2>
                <Info label="Email" value={s.email} />
                <Info label="Opleiding" value={s.opleiding} />
                <Info label="Specialisatie" value={s.specialisatie || "—"} />
                <Info label="Talen" value={s.talen?.join(', ') || "—"} /> {/* Join array for display */}

                <div className="mt-4 flex gap-3">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                        // Voorbeeld: Fetch speeddates van specifieke student
                        // Voor dit te laten werken, moet de backend een route hebben zoals /api/students/:studentId/speeddates
                        // En de speeddateModel moet ook een link naar student hebben als "geboekt door"
                        alert("Geplande speeddates functionaliteit nog niet geïmplementeerd (backend route ontbreekt).");
                        setSelected(s); // Toon de modal, zelfs zonder echte data
                    }}
                  >
                    Geplande speeddates
                  </button>
                  <button
                    className="bg-orange-600 text-white px-3 py-1 rounded"
                    onClick={() => verwijderStudent(s._id)}
                  >
                    Verwijder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">
              Speeddates van {selected.voornaam}
            </h3>

            {/* Hier zou je de speeddates van de geselecteerde student moeten laden */}
            {!selected.speeddates || selected.speeddates.length === 0 ? (
              <p className="text-gray-600">Geen speeddates geboekt voor deze student.</p>
            ) : (
              <ul className="space-y-2">
                {selected.speeddates.map((sd) => (
                  <li
                    key={sd.id || sd._id}
                    className="flex justify-between bg-gray-100 px-3 py-2 rounded"
                  >
                    <span>{sd.bedrijf?.naam || "Onbekend"}</span>
                    <span className="font-semibold">{sd.tijd || "-"}</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setSelected(null)}
              className="mt-6 bg-gray-700 text-white px-4 py-1 rounded w-full"
            >
              Sluit Speeddates
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ label, value }) => (
  <p className="text-gray-700">
    <strong>{label}:</strong> {value}
  </p>
);

export default StudentenBeheer;