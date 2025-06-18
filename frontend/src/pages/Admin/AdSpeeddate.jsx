// AdminSpeedDates.jsx
import React, { useState, useEffect } from 'react';
import '../Student/SpeedDates.css';

const AdminSpeedDates = () => {
  const [speedDates, setSpeedDates] = useState([]);
  const [filters, setFilters] = useState({
    sector: [],
    opportuniteit: [],
    taal: []
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('earliest');
  const [uniqueSectors, setUniqueSectors] = useState([]);
  const [uniqueLanguages, setUniqueLanguages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hulpfunctie om API-requests te doen met authenticatie
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Netwerk- of serverfout.' }));
      console.error(`API Fout (${url}):`, response.status, errorData);
      if (response.status === 401 || response.status === 403) {
        alert("Je sessie is verlopen of niet toegestaan. Gelieve opnieuw in te loggen.");
        // window.location.href = '/login';
      }
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  useEffect(() => {
    fetchSpeeddates();
  }, []);

  const fetchSpeeddates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authenticatedFetch("http://localhost:4000/api/speeddates");
      setSpeedDates(data.speeddates);

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
      setError("Fout bij het laden van speeddates: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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
    setSortOrder('earliest');
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Weet je zeker dat je deze speeddate wilt verwijderen?")) {
      return;
    }

    try {
      await authenticatedFetch(`http://localhost:4000/api/speeddates/${id}`, {
        method: 'DELETE',
      });

      setSpeedDates(prev => prev.filter(date => date._id !== id));
      alert('Speeddate succesvol verwijderd.');

    } catch (err) {
      console.error("Fout bij verwijderen:", err);
      alert(`Fout bij verwijderen: ${err.message || "Onbekende fout"}`);
    }
  };

  const filteredAndSortedDates = speedDates
  .filter(date => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      date.bedrijf?.name?.toLowerCase().includes(term) ||
      date.vakgebied?.toLowerCase().includes(term);

    const matchesFilters =
      (filters.sector.length === 0 || filters.sector.includes(date.vakgebied)) &&
      (filters.opportuniteit.length === 0 || (date.opportuniteit && filters.opportuniteit.some(o => date.opportuniteit.includes(o)))) &&
      (filters.taal.length === 0 || (date.talen && date.talen.some(t => filters.taal.includes(t))));

    return matchesSearch && matchesFilters;
  })
    .sort((a, b) => {
      const timeA = a.starttijd ? new Date(`2000-01-01T${a.starttijd}:00`) : new Date(0);
      const timeB = b.starttijd ? new Date(`2000-01-01T${b.starttijd}:00`) : new Date(0);


      if (sortOrder === 'earliest') {
        return timeA - timeB;
      } else {
        return timeB - timeA;
      }
    });

  if (loading) {
    return <div className="text-center py-10">Laden van speeddates...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  const getSectorClassName = (sector) => {
    if (!sector) return '';
    return sector.replace(/[^a-zA-Z0-9]/g, '');
  };

  return (
    <div className="speeddates-container">
      <header className="header">
        <h1 className="speeddates__title">Speeddates beheer</h1>
        <p className="speeddates__subtitle">Hier kan u de speeddates verwijderen indien nodig</p>
      </header>

      <div className="zoekbalk">
              <input
               type="text"
               placeholder="Zoek op sector of bedrijfsnaam..."
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               />
               </div>

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
              <h3>Type opportuniteit</h3>
              <div className="checkbox-grid">
                {["Stage", "Studentenjob", "Bachelorproef"].map((type) => (
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
    {["Nederlands", "Engels", "Frans"].map((taal) => (
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

            <div className="filter-group">
              <h3>Sorteren op Tijd</h3>
              <div className="radio-group">
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
              <button
                className="reset-btn"
                onClick={() => resetFilters()} // AANGEPAST: roep resetFilters direct aan
              >
                <i className="fas fa-undo mr-2"></i> Reset filters
              </button>
              <button
                className="apply-btn"
                onClick={() => setShowFilters(false)}
              >
                <i className="fas fa-check mr-2"></i> Filters toepassen
              </button>
            </div>
          </div>
        )}

        <div className="results-section">
          <h2>Speeddates <span className="result-count">({filteredAndSortedDates.length})</span></h2>

          {filteredAndSortedDates.length > 0 ? (
            <div className="speeddates-grid">
              {filteredAndSortedDates.map((date) => (
                <div key={date._id} className="speeddate-card">
                  <div className="card-header">
                    <h3>{date.bedrijf?.name || 'Onbekend Bedrijf'}</h3>
                    <span className={`sector-tag ${getSectorClassName(date.vakgebied)}`}>{date.vakgebied}</span>
                  </div>
                  <div className="card-body">
                    <p><i className="far fa-clock"></i> {date.starttijd} - {date.eindtijd}</p>
                    {/* AANGEPAST: Toon de naam van het lokaalobject */}
                    <p><i className="fas fa-map-marker-alt"></i> {date.lokaal?.name || 'Lokaal onbekend'}</p>
                    <p><i className="fas fa-microscope"></i> {date.focus}</p>
                    <p><i className="fas fa-handshake"></i> {date.opportuniteit?.join(', ') || 'N/B'}</p>
                    <p><i className="fas fa-language"></i> {date.talen?.join(', ') || 'N/B'}</p>
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
              <p>Geen speeddates gevonden met de geselecteerde filters.</p>
              <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSpeedDates;