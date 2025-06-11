// SpeedDates.js
import React, { useState, useEffect } from 'react';
import './SpeedDates.css';

const SpeedDates = () => {
  const [speedDates, setSpeedDates] = useState([]);
  const [filters, setFilters] = useState({
    sector: [],
    opportuniteit: [],
    taal: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem('userId');

  useEffect(() => {
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

    fetchSpeeddates();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      const index = newFilters[filterType].indexOf(value);

      if (index === -1) {
        newFilters[filterType].push(value);
      } else {
        newFilters[filterType].splice(index, 1);
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      sector: [],
      opportuniteit: [],
      taal: []
    });
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  const filteredDates = speedDates.filter(date => {
    return (
      (filters.sector.length === 0 || filters.sector.includes(date.vakgebied)) &&
      (filters.opportuniteit.length === 0 || filters.opportuniteit.some(o => date.opportuniteit.includes(o))) &&
      (filters.taal.length === 0 || filters.talen.some(t => date.talen.includes(t)))
    );
  });

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleApply = async (speeddateId) => {
    if (!studentId) {
      alert("Log in als student om een afspraak aan te vragen.");
      return;
    }

    if (!window.confirm("Weet je zeker dat je deze speeddate wilt aanvragen?")) {
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/aanvragen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speeddateId, studentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Aanvraag mislukt.");
      }

      alert(data.message);
      setSpeedDates(prevDates =>
        prevDates.map(date =>
          date._id === speeddateId ? { ...date, status: 'aangevraagd', aangevraagdDoor: studentId } : date
        )
      );
    } catch (err) {
      console.error("Fout bij aanvragen:", err);
      alert(`Fout bij het aanvragen: ${err.message || "Onbekende fout"}`);
    }
  };

  const isApplyDisabled = (speeddate) => {
    return speeddate.status !== 'open' || speeddate.aangevraagdDoor !== null;
  };

  const getApplyButtonText = (speeddate) => {
    if (speeddate.status === 'aangevraagd' && speeddate.aangevraagdDoor === studentId) {
      return 'Reeds aangevraagd door jou';
    }
    if (speeddate.status === 'bevestigd') {
      return 'Afspraak bevestigd';
    }
    if (speeddate.status === 'aangevraagd') {
      return 'Reeds aangevraagd';
    }
    return 'Afspraak aanvragen';
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
        <h1 className="speeddates__title">Speeddates</h1>
        <p className="speeddates__subtitle">Vind jouw ideale stage, afstudeerproject of bijbaan</p>
      </header>

      <div className="main-content">
        <button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Filters verbergen' : 'Filters tonen'}
        </button>

        {showFilters && (
          <div className="filter-section">
            <div className="filter-group">
              <h3>Sector / Focus</h3>
              <div className="checkbox-grid">
                {["Web Development", "Cybersecurity", "AI / Machine Learning", "DevOps", "UX/UI"].map((sector) => (
                  <label key={sector} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.sector.includes(sector)}
                      onChange={() => handleFilterChange('sector', sector)}
                    />
                    <span className="checkmark"></span>
                    {sector}
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <h3>Type opportuniteit</h3>
              <div className="checkbox-grid">
                {["Stage", "Afstudeerproject", "Bijbaan / Werkstudent"].map((type) => (
                  <label key={type} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.opportuniteit.includes(type)}
                      onChange={() => handleFilterChange('opportuniteit', type)}
                    />
                    <span className="checkmark"></span>
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Taal</h3>
              <div className="checkbox-grid">
                {["Nederlands", "Engels", "Spaans", "Portugees", "Arabisch"].map((taal) => (
                  <label key={taal} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.taal.includes(taal)}
                      onChange={() => handleFilterChange('taal', taal)}
                    />
                    <span className="checkmark"></span>
                    {taal}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-buttons">
              <button className="apply-btn" onClick={applyFilters}>Filters toepassen</button>
              <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
            </div>
          </div>
        )}

        <div className="results-section">
          <h2>Beschikbare SpeedDates <span className="result-count">({filteredDates.length})</span></h2>

          {filteredDates.length > 0 ? (
            <div className="speeddates-grid">
              {filteredDates.map((date) => (
                <div key={date._id} className="speeddate-card">
                  <div className="card-header">
                    <h3>{date.bedrijf?.name || 'Laden...'}</h3>
                    <span className={`sector-tag ${date.vakgebied.replace(/[^a-zA-Z]/g, '')}`}>{date.vakgebied}</span>
                  </div>
                  <div className="card-body">
                    <p><i className="far fa-clock"></i> {date.starttijd} - {date.eindtijd}</p>
                    <p><i className="fas fa-map-marker-alt"></i> {date.lokaal}</p> {/* NIEUW: Toon lokaal */}
                    <p><i className="fas fa-microscope"></i> {date.focus}</p>
                    <p><i className="fas fa-handshake"></i> {date.opportuniteit.join(', ')}</p>
                    <p><i className="fas fa-language"></i> {date.talen.join(', ')}</p>
                    <p className="description">{date.beschrijving}</p>
                  </div>
                  <div className="card-footer">
                    <button
                      className="details-btn"
                      onClick={() => toggleDetails(date._id)}
                    >
                      {expandedId === date._id ? 'Minder details' : 'Bekijk meer'}
                    </button>
                  </div>

                  {expandedId === date._id && (
                    <div className="expanded-details">
                      <h4>Meer informatie</h4>
                      <p>
                        Deze speeddate is een uitgelezen kans om te spreken over {date.focus} binnen {date.vakgebied}.<br />
                        Locatie: {date.lokaal}<br /> {/* Toon lokaal in details */}
                        Beschikbare talen: {date.talen.join(', ')}.<br />
                        Gezochte opportuniteiten: {date.opportuniteit.join(', ')}.
                      </p>
                      <button
                        className="apply-now-btn"
                        onClick={() => handleApply(date._id)}
                        disabled={isApplyDisabled(date)}
                      >
                        {getApplyButtonText(date)}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <i className="far fa-frown"></i>
              <p>Geen speeddates gevonden met de geselecteerde filters.</p>
              <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeedDates;
