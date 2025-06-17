import React, { useEffect, useState, useMemo } from "react";
import '../student/speedDates.css';
function StudentenZoeken() {
  const [studenten, setStudenten] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOpleiding, setSelectedOpleiding] = useState("");
  const [selectedSpecialisatie, setSelectedSpecialisatie] = useState("");
  const [selectedTalen, setSelectedTalen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true); // Standaard tonen we filters

  useEffect(() => {
    const fetchStudenten = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:4000/api/students", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bedrijfToken")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Fout bij ophalen van studenten.");
        }

        const data = await res.json();
        setStudenten(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Kan studenten niet ophalen.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudenten();
  }, []);

  // functie om talen mooi weer te geven
  const formatTalen = (talen) => {
    if (!talen || talen.length === 0) return "—";

    if (Array.isArray(talen)) {
      return talen.join(", ");
    }

    return talen
      .split(",")
      .map(t => t.trim())
      .filter(t => t)
      .join(", ");
  };

  const uniekeOpleidingen = useMemo(() => {
    const opleidingen = studenten.map((s) => s.opleiding);
    return [...new Set(opleidingen)].filter(Boolean).sort();
  }, [studenten]);

  const uniekeSpecialisaties = useMemo(() => {
    const specialisaties = studenten.map((s) => s.specialisatie);
    return [...new Set(specialisaties)].filter(Boolean).sort();
  }, [studenten]);

  const vasteTalen = ["Nederlands", "Frans", "Engels"];

  const handleTaalChange = (event) => {
    const taal = event.target.value;
    if (selectedTalen.includes(taal)) {
      setSelectedTalen(selectedTalen.filter((t) => t !== taal));
    } else {
      setSelectedTalen([...selectedTalen, taal]);
    }
  };

  const filteredStudenten = useMemo(() => {
    return studenten.filter((s) => {
      const matchOpleiding = selectedOpleiding ? s.opleiding === selectedOpleiding : true;
      const matchSpecialisatie = selectedSpecialisatie ? s.specialisatie === selectedSpecialisatie : true;

      const studentTalen = [];
      if (typeof s.talen === 'string' && s.talen) {
        studentTalen.push(...s.talen.split(',').map(t => t.trim().toLowerCase()).filter(Boolean));
      } else if (Array.isArray(s.talen)) {
        studentTalen.push(...s.talen.map(t => t.trim().toLowerCase()).filter(Boolean));
      }

      const matchTalen = selectedTalen.length === 0 ||
        selectedTalen.some(selectedTaal => studentTalen.includes(selectedTaal.toLowerCase()));

      return matchOpleiding && matchSpecialisatie && matchTalen;
    });
  }, [studenten, selectedOpleiding, selectedSpecialisatie, selectedTalen]);

  return (
    <div className="speeddates-container">
      <header className="header">
        <h1 className="speeddates__title">Studenten zoeken</h1>
        <p className="speeddates__subtitle">Vind geschikte studenten voor jouw speeddates, druk op hun email en stuur een mailtje!</p>
      </header>
  
      <div className="main-content">
        {error && (
          <p className="text-center text-red-600 font-medium mb-6">{error}</p>
        )}
  
        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <i className={`fas fa-${showFilters ? 'times' : 'filter'}`}></i>
          {showFilters ? 'Filters verbergen' : 'Filters tonen'}
        </button>
  
        {loading ? (
          <p className="text-center text-gray-500">Studenten worden geladen...</p>
        ) : studenten.length === 0 && !error ? (
          <div className="no-results">
            <i className="far fa-frown"></i>
            <p>Er zijn momenteel geen studenten beschikbaar om te filteren.</p>
          </div>
        ) : (
          <>
            {showFilters && (
              <div className="filter-section">
                <div className="filter-group">
                  <h3>Talen</h3>
                  <div className="checkbox-grid">
                    {vasteTalen.map((taal) => (
                      <label key={taal} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={taal}
                          checked={selectedTalen.includes(taal)}
                          onChange={handleTaalChange}
                        />
                        <span className="checkmark"></span>
                        {taal}
                      </label>
                    ))}
                  </div>
                </div>
  
                <div className="filter-group">
                  <h3>Opleiding</h3>
                  <select
                    className="profiel-input"
                    value={selectedOpleiding}
                    onChange={(e) => setSelectedOpleiding(e.target.value)}
                  >
                    <option value="">Alle opleidingen</option>
                    {uniekeOpleidingen.map((opleiding) => (
                      <option key={opleiding} value={opleiding}>
                        {opleiding}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div className="filter-group">
                  <h3>Specialisatie</h3>
                  <select
                    className="profiel-input"
                    value={selectedSpecialisatie}
                    onChange={(e) => setSelectedSpecialisatie(e.target.value)}
                  >
                    <option value="">Alle specialisaties</option>
                    {uniekeSpecialisaties.map((specialisatie) => (
                      <option key={specialisatie} value={specialisatie}>
                        {specialisatie}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div className="filter-buttons">
                  <button 
                    onClick={() => {
                      setSelectedOpleiding("");
                      setSelectedSpecialisatie("");
                      setSelectedTalen([]);
                    }} 
                    className="reset-btn"
                  >
                    <i className="fas fa-undo mr-2"></i> Reset filters
                  </button>
                  <button 
                    onClick={() => setShowFilters(false)} 
                    className="apply-btn"
                  >
                    <i className="fas fa-check mr-2"></i> Filters toepassen
                  </button>
                </div>
              </div>
            )}
  
            <div className="results-section">
              <h2>Gevonden Studenten <span className="result-count">({filteredStudenten.length})</span></h2>
  
              {filteredStudenten.length === 0 ? (
                <div className="no-results">
                  <i className="far fa-frown"></i>
                  <p>Geen studenten gevonden met de huidige filters.</p>
                  <button 
                    onClick={() => {
                      setSelectedOpleiding("");
                      setSelectedSpecialisatie("");
                      setSelectedTalen([]);
                    }} 
                    className="reset-btn mt-4"
                  >
                    <i className="fas fa-undo mr-2"></i> Reset alle filters
                  </button>
                </div>
              ) : (
                <div className="speeddates-grid">
                  {filteredStudenten.map((s) => (
                    <div key={s._id} className="speeddate-card">
                      <div className="card-header">
                        <h3>{s.voornaam} {s.achternaam}</h3>
                      </div>
                      <div className="card-body">
                        <p><i className="fas fa-envelope"></i> <a href={`mailto:${s.email}`} className="mail-link"> {s.email} </a> </p>
                        <p><i className="fas fa-graduation-cap"></i> {s.opleiding}</p>
                        <p><i className="fas fa-book"></i> {s.specialisatie || "—"}</p>
                        <p><i className="fas fa-language"></i> {formatTalen(s.talen)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentenZoeken;
