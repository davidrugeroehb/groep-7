// AdminSpeedDates.jsx
import React, { useState, useEffect } from 'react';
import '../Student/SpeedDates.css'; // Je kan dezelfde CSS hergebruiken

const AdminSpeedDates = () => {
  const [speedDates, setSpeedDates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpeeddates();
  }, []);

  const fetchSpeeddates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/api/student/speeddates");
      if (!res.ok) {
        throw new Error("Kon speeddates niet ophalen.");
      }
      const data = await res.json();
      setSpeedDates(data.speeddates);
    } catch (err) {
      console.error("Fout bij ophalen speeddates:", err);
      setError("Fout bij het laden van speeddates.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Weet je zeker dat je deze speeddate wilt verwijderen?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/admin/speeddates/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Verwijderen mislukt.');
      }

      // Verwijder de speeddate lokaal uit de lijst
      setSpeedDates(prev => prev.filter(date => date._id !== id));
      alert('Speeddate succesvol verwijderd.');

    } catch (err) {
      console.error("Fout bij verwijderen:", err);
      alert(`Fout bij verwijderen: ${err.message || "Onbekende fout"}`);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Laden van speeddates...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="speeddates-container">
      <header className="header">
        <h1 className="speeddates__title">Beheer Speeddates</h1>
        <p className="speeddates__subtitle">Verwijder speeddates uit het systeem</p>
      </header>

      <div className="results-section">
        <h2>Alle Speeddates <span className="result-count">({speedDates.length})</span></h2>

        {speedDates.length > 0 ? (
          <div className="speeddates-grid">
            {speedDates.map((date) => (
              <div key={date._id} className="speeddate-card">
                <div className="card-header">
                  <h3>{date.bedrijf?.name || 'Laden...'}</h3>
                  <span className="sector-tag">{date.vakgebied}</span>
                </div>
                <div className="card-body">
                  <p><i className="far fa-clock"></i> {date.starttijd} - {date.eindtijd}</p>
                  <p><i className="fas fa-map-marker-alt"></i> {date.lokaal}</p>
                  <p><i className="fas fa-microscope"></i> {date.focus}</p>
                  <p><i className="fas fa-handshake"></i> {date.opportuniteit.join(', ')}</p>
                  <p><i className="fas fa-language"></i> {date.talen.join(', ')}</p>
                  <p className="description">{date.beschrijving}</p>
                </div>
                <div className="card-footer">
                  <button className="delete-btn text-red-600" onClick={() => handleDelete(date._id)}>
                    Verwijderen
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <i className="far fa-frown"></i>
            <p>Geen speeddates beschikbaar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSpeedDates;
