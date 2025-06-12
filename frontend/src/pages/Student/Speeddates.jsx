// SpeedDates.jsx
import React, { useState, useEffect } from 'react';
import './SpeedDates.css'; // Zorg dat dit CSS-bestand de benodigde stijlen bevat

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

  // Staten voor dynamische filteropties
  const [uniqueSectors, setUniqueSectors] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);

  // NIEUW: Staat voor sortering
  const [sortOrder, setSortOrder] = useState('earliest'); // 'earliest' (vroegst) of 'latest' (laatst)

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

        // Unieke waarden ophalen voor dynamische filters
        const sectors = new Set();
        const languages = new Set();
        data.speeddates.forEach(date => {
          sectors.add(date.vakgebied);
          date.talen.forEach(lang => languages.add(lang));
        });
        setUniqueSectors(Array.from(sectors).sort());
        setUniqueLanguages(Array.from(languages).sort());

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
    setSortOrder('earliest'); // Reset sortering ook
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  // Eerst filteren, dan sorteren
  const filteredAndSortedDates = speedDates
    .filter(date => {
      return (
        (filters.sector.length === 0 || filters.sector.includes(date.vakgebied)) &&
        (filters.opportuniteit.length === 0 || filters.opportuniteit.some(o => date.opportuniteit.includes(o))) &&
        (filters.taal.length === 0 || date.talen.some(t => filters.taal.includes(t)))
      );
    })
    .sort((a, b) => {
      // Datum parseren uit "HH:mm" strings voor vergelijking
      const timeA = new Date(`2000-01-01T${a.starttijd}:00`);
      const timeB = new Date(`2000-01-01T${b.starttijd}:00`);

      if (sortOrder === 'earliest') {
        return timeA - timeB; // Van vroegst naar laatst
      } else {
        return timeB - timeA; // Van laatst naar vroegst
      }
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
    return speeddate.status !== 'open' || (speeddate.aangevraagdDoor && speeddate.aangevraagdDoor !== studentId);
  };

  const getApplyButtonText = (speeddate) => {
    if (speeddate.status === 'aangevraagd' && speeddate.aangevraagdDoor === studentId) {
      return 'Reeds aangevraagd door jou';
    }
    if (speeddate.status === 'bevestigd') {
      return 'Afspraak bevestigd';
    }
    if (speeddate.status === 'aangevraagd') {
      return 'Reeds aangevraagd door een andere student';
    }
    return 'Afspraak aanvragen';
  };

  if (loading) {
    return <div className="text-center py-10">Laden van speeddates...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  const getSectorClassName = (sector) => {
    return sector.replace(/[^a-zA-Z0-9]/g, '');
  };

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
          <i className={`fas ${showFilters ? 'fa-times' : 'fa-filter'}`}></i>
          {showFilters ? 'Filters verbergen' : 'Filters tonen'}
        </button>

        {showFilters && (
          <div className="filter-section">
            <div className="filter-group">
              <h3>Sector / Focus</h3>
              <div className="checkbox-grid">
                {uniqueSectors.map((sector) => (
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
                {["Stage", "Studentenjob", "Bachelorproef"].map((type) => ( // AANGEPAST: Nieuwe opties
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
                {uniqueLanguages.map((taal) => (
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

            {/* NIEUW: Sortering op tijd */}
            <div className="filter-group">
              <h3>Sorteren op Tijd</h3>
              <div className="radio-group"> {/* Je kunt een radio-groep of dropdown gebruiken */}
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="sortTime"
                    value="earliest"
                    checked={sortOrder === 'earliest'}
                    onChange={() => setSortOrder('earliest')}
                  />
                  <span className="checkmark"></span>
                  Vroegste eerst
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="sortTime"
                    value="latest"
                    checked={sortOrder === 'latest'}
                    onChange={() => setSortOrder('latest')}
                  />
                  <span className="checkmark"></span>
                  Laatste eerst
                </label>
              </div>
            </div>


            <div className="filter-buttons">
              <button className="apply-btn" onClick={applyFilters}>Filters toepassen</button>
              <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
            </div>
          </div>
        )}

        <div className="results-section">
          <h2>Beschikbare SpeedDates <span className="result-count">({filteredAndSortedDates.length})</span></h2>

          {filteredAndSortedDates.length > 0 ? (
            <div className="speeddates-grid">
              {filteredAndSortedDates.map((date) => (
                <div key={date._id} className="speeddate-card">
                  <div className="card-header">
                    <h3>{date.bedrijf?.name || 'Laden...'}</h3>
                    <span className={`sector-tag ${getSectorClassName(date.vakgebied)}`}>{date.vakgebied}</span>
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
                        Locatie: {date.lokaal}<br />
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