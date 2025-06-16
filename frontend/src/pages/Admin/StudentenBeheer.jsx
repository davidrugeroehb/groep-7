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
    <div className="studentenbeheer-container">
      <div className="header">
        <h1>Studenten beheren</h1>
      </div>

      <div className="main-content">
        {error && <p className="error-message">{error}</p>}

        {studenten.length === 0 && !error ? (
          <p className="geen-studenten">Er zijn momenteel geen studenten beschikbaar.</p>
        ) : (
          <div className="studenten-lijst">
            <div className="grid md:grid-cols-2 gap-6">
              {studenten.map((s) => (
                <div key={s._id} className="student-card">
                  <div className="student-header">
                    <h3>{s.voornaam} {s.achternaam}</h3>
                  </div>
                  
                  <div className="student-meta">
                    <span><i className="fas fa-envelope"></i> {s.email}</span>
                    <span><i className="fas fa-graduation-cap"></i> {s.opleiding}</span>
                    {s.specialisatie && <span><i className="fas fa-certificate"></i> {s.specialisatie}</span>}
                    {s.talen && s.talen.length > 0 && <span><i className="fas fa-language"></i> {s.talen.join(', ')}</span>}
                    </div>

                  <div className="student-acties">
                    <button
                      className="speeddates-btn"
                      onClick={() => setSelected(s)}
                    >
                      <i className="far fa-calendar-alt"></i> Geplande speeddates
                    </button>
                    <button
                      className="verwijder-btn"
                      onClick={() => verwijderStudent(s._id)}
                    >
                      <i className="far fa-trash-alt"></i> Verwijder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="modal">
          <div className="modal-inhoud">
            <h2>Speeddates van {selected.voornaam}</h2>

            {!selected.speeddates || selected.speeddates.length === 0 ? (
              <p>Geen speeddates geboekt voor deze student.</p>
            ) : (
              <ul className="speeddate-lijst">
                {selected.speeddates.map((sd) => (
                  <li key={sd.id || sd._id} className="speeddate-item">
                    <span>{sd.bedrijf?.naam || "Onbekend"}</span>
                    <span className="tijd">{sd.tijd || "-"}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="modal-acties">
              <button
                onClick={() => setSelected(null)}
                className="sluit-btn"
              >
                Sluit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ label, value }) => (
  <p className="student-info">
    <span className="info-label">{label}:</span> <span className="info-value">{value}</span>
  </p>
);

export default StudentenBeheer;