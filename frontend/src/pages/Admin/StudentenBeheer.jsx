import React, { useEffect, useState } from "react";
import './StudentenBeheer.css';

function StudentenBeheer() {
  const [studenten, setStudenten] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = 'http://localhost:4000/api'; // Zorg dat dit overeenkomt met je backend URL

  const gefilterdeStudenten = studenten.filter((s) =>
    s.voornaam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.achternaam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.opleiding.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

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


  const verwijderStudent = async (id) => {
    if (!window.confirm("Weet je zeker dat je deze student wilt verwijderen?")) {
      return;
    }
    try {
      // **** CRUCIALE CHECK: Zorg dat de URL van de fetch correct is en de DELETE methode ****
      // De URL moet zijn: http://localhost:4000/api/students/DE_STUDENT_ID
      await authenticatedFetch(`${API_BASE_URL}/students/${id}`, { // <-- Zorg dat deze URL exact zo is
        method: 'DELETE', // <-- Zorg dat de methode DELETE is
      });
      setStudenten((prev) => prev.filter((s) => s._id !== id));
      alert("Student succesvol verwijderd!");
    } catch (err) {
      console.error("Fout bij verwijderen student:", err);
      alert(`Fout bij verwijderen student: ${err.message || "Onbekende fout"}`);
    }
  };

  useEffect(() => {
    const fetchStudenten = async () => {
      try {
        const data = await authenticatedFetch(`${API_BASE_URL}/students`);
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
        <h1>Studenten beheer</h1>
      </div>

      <div className="zoekbalk">
        <input
         type="text"
         placeholder="Zoek op naam of opleiding..."
         value={searchTerm}
         onChange={e => setSearchTerm(e.target.value)}/>
         </div>


      <div className="main-content">
        {error && <p className="error-message">{error}</p>}

        {gefilterdeStudenten.length === 0 && !error ? (
          <p className="geen-studenten">Er zijn momenteel geen studenten beschikbaar.</p>
        ) : (
          <div className="studenten-lijst">
            <div className="grid md:grid-cols-2 gap-6">

              {gefilterdeStudenten.map((s) => (
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
                      onClick={() => {
                          alert("Geplande speeddates functionaliteit voor studenten is nog niet geïmplementeerd. (Backend route voor student speeddates ontbreekt)");
                          setSelected(s);
                      }}
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