import React, { useState, useEffect } from 'react';

const HomeBedrijf = () => {
  const [speedDates, setSpeedDates] = useState([]); // Dynamische speeddates van het bedrijf
  const [filters, setFilters] = useState({
    vakgebied: [], // Filter op vakgebied
    opportuniteit: [],
    talen: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const bedrijfId = localStorage.getItem('userId'); // Haal bedrijf ID op uit localStorage

  // Functie om speeddates van DIT bedrijf op te halen
  useEffect(() => {
    const fetchCompanySpeeddates = async () => {
      if (!bedrijfId) {
        setError("Bedrijf ID niet gevonden. Log in als bedrijf.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:4000/api/bedrijf/speeddates/${bedrijfId}`);
        if (!res.ok) {
          throw new Error("Kon speeddates niet ophalen.");
        }
        const data = await res.json();
        setSpeedDates(data.speeddates); // De API response heeft 'speeddates' als een array
      } catch (err) {
        console.error("Fout bij ophalen bedrijfs speeddates:", err);
        setError("Fout bij het laden van jouw speeddates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanySpeeddates();
  }, [bedrijfId]); // Herlaad bij wijziging van bedrijfId


  const verwijderSpeeddate = async (id) => {
    if (!window.confirm("Weet u zeker dat u de speeddate wilt verwijderen?")) {
      return;
    }
    try {
      // Voeg een API call toe om de speeddate uit de database te verwijderen
      const res = await fetch(`http://localhost:4000/api/bedrijf/speeddates/${id}`, {
        method: "DELETE",
        // Voeg hier eventueel authenticatie headers toe indien nodig
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verwijderen mislukt.");
      }

      alert(data.message);
      // Verwijder lokaal uit de lijst na succesvolle verwijdering
      setSpeedDates((prev) => prev.filter((date) => date._id !== id));
    } catch (err) {
      console.error("Fout bij verwijderen speeddate:", err);
      alert(`Verwijderen mislukt: ${err.message || "Onbekende fout"}`);
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
      vakgebied: [],
      opportuniteit: [],
      talen: []
    });
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  const filteredDates = speedDates.filter(date => {
    return (
      (filters.vakgebied.length === 0 || filters.vakgebied.includes(date.vakgebied)) &&
      (filters.opportuniteit.length === 0 || filters.opportuniteit.some(o => date.opportuniteit.includes(o))) &&
      (filters.talen.length === 0 || filters.talen.some(t => date.talen.includes(t)))
    );
  });
  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };


  if (loading) {
    return <div className="text-center py-10">Laden van jouw speeddates...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="speeddates-container">
      <header className="header">
        <h1 className="speeddates__title">Jouw Speeddates</h1>
        <p className="speeddates__subtitle">Beheer de speeddates die je hebt aangemaakt</p>
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
              <h3>Vakgebied</h3>
              <div className="checkbox-grid">
                {["Web Development", "Cybersecurity", "AI / Machine Learning", "DevOps", "UX/UI"].map((sector) => (
                  <label key={sector} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.vakgebied.includes(sector)}
                      onChange={() => handleFilterChange('vakgebied', sector)}
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
                      checked={filters.talen.includes(taal)}
                      onChange={() => handleFilterChange('talen', taal)}
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
          <h2>Jouw Aangemaakte SpeedDates <span className="result-count">({filteredDates.length})</span></h2>

          {filteredDates.length > 0 ? (
            <div className="speeddates-grid">
              {filteredDates.map((date) => (
                <div key={date._id} className="speeddate-card">
                  <div className="card-header">
                    <h3>{date.bedrijf?.name || 'Jouw Bedrijf'}</h3> {/* Bedrijfsnaam populaten indien nodig */}
                    <span className={`sector-tag ${date.vakgebied.replace(/[^a-zA-Z]/g, '')}`}>{date.vakgebied}</span>
                  </div>
                  <div className="card-body">
                    <p><i className="far fa-clock"></i> {date.starttijd} - {date.eindtijd}</p>
                    <p><i className="fas fa-microscope"></i> {date.focus}</p>
                    <p><i className="fas fa-handshake"></i> {date.opportuniteit.join(', ')}</p>
                    <p><i className="fas fa-language"></i> {date.talen.join(', ')}</p>
                    <p className="description">{date.beschrijving}</p>
                    <p className="status-indicator">
                      <strong>Status: </strong>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        date.status === 'open' ? 'bg-green-100 text-green-800' :
                        date.status === 'aangevraagd' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800' // Bevestigd
                      }`}>
                        {date.status}
                      </span>
                      {date.aangevraagdDoor && date.status === 'aangevraagd' && (
                        <span className="ml-2 text-sm text-gray-600">(Aangevraagd door student)</span>
                      )}
                      {date.aangevraagdDoor && date.status === 'bevestigd' && (
                        <span className="ml-2 text-sm text-gray-600">(Bevestigd met student)</span>
                      )}
                    </p>
                  </div>
                  <div className="card-footer">
                    <button
                      className="details-btn"
                      onClick={() => toggleDetails(date._id)}
                    >
                      {expandedId === date._id ? 'Minder details' : 'Bekijk meer'}
                    </button>
                    <button onClick={() => verwijderSpeeddate(date._id)} className='bg-red-600 text-white w-full py-2 rounded-md text-base transition mt-2'>
                      Verwijder SpeedDate
                    </button>
                  </div>

                  {expandedId === date._id && (
                    <div className="expanded-details">
                      <h4>Meer informatie</h4>
                      <p>
                        Dit is een speeddate over {date.focus} binnen {date.vakgebied}.<br />
                        Beschikbare talen: {date.talen.join(', ')}.<br />
                        Gezochte opportuniteiten: {date.opportuniteit.join(', ')}.
                      </p>
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


export default HomeBedrijf;
