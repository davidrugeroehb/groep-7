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
  // Bepaal unieke vakgebieden op basis van de speedDates
  const uniekeVakgebieden = Array.from(new Set(speedDates.map(date => date.vakgebied))).filter(Boolean);

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
        // AANGEPAST: Correcte route met '/api/speeddates/bedrijf'
        // Let op: 'bedrijf' hier is deel van de route zelf, niet de algemene prefix
        const res = await fetch(`http://localhost:4000/api/speeddates/bedrijf/${bedrijfId}`);
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
    if (!window.confirm("Weet u zeker dat u de speeddate en alle gekoppelde aanvragen wilt verwijderen?")) {
      return;
    }
    try {
      // AANGEPAST: Correcte route voor verwijderen speeddate
      // Let op: Geen '/bedrijf' in de delete route, want die zit direct onder /api/speeddates
      const res = await fetch(`http://localhost:4000/api/speeddates/${id}`, {
        method: "DELETE",
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
      (filters.talen.length === 0 || date.talen.some(t => filters.talen.includes(t)))
    );
  });

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getSlotStatusClass = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'aangevraagd': return 'bg-yellow-100 text-yellow-800';
      case 'bevestigd': return 'bg-blue-100 text-blue-800';
      case 'afgekeurd': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                {uniekeVakgebieden.length > 0 ? uniekeVakgebieden.map((sector) => (
                  <label key={sector} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.vakgebied.includes(sector)}
                      onChange={() => handleFilterChange('vakgebied', sector)}
                    />
                    <span className="checkmark"></span>
                    {sector}
                  </label>
                )) : <p>Geen vakgebieden gevonden.</p>}
              </div>
            </div>
            <div className="filter-group">
              <h3>Type opportuniteit</h3>
              <div className="checkbox-grid">
                {["Stage", "Studentenjob", "Bachelorproef"].map((type) => ( // Updated: consistent with Aanmaken.jsx and Speeddates.jsx
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
                {["Nederlands", "Engels", "Frans"].map((taal) => ( // Updated: consistent with Aanmaken.jsx and Speeddates.jsx
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
                    <h3>{date.bedrijf?.name || 'Jouw Bedrijf'}</h3>
                    <span className={`sector-tag ${date.vakgebied.replace(/[^a-zA-Z]/g, '')}`}>{date.vakgebied}</span>
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
                    <button 
  onClick={() => verwijderSpeeddate(date._id)} 
  className="delete-btn"
>
  <i className="fas fa-trash-alt"></i>
  Verwijder speeddate
</button>
                  </div>

                  {expandedId === date._id && (
                    <div className="expanded-details mt-4 p-3 border-t border-gray-200">
                      <h4 className="font-semibold text-lg mb-2">Individuele Slots:</h4>
                      {date.slots && date.slots.length > 0 ? (
                        <ul className="space-y-2">
                          {date.slots.map(slot => (
                            <li key={slot._id} className="flex justify-between items-center p-2 border rounded-md bg-gray-50">
                              <span>
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getSlotStatusClass(slot.status)}`}>
                                {slot.status === 'aangevraagd' && slot.student ? `Aangevraagd (${slot.student.voornaam || ''} ${slot.student.achternaam || ''})` :
                                  slot.status === 'bevestigd' && slot.student ? `Bevestigd (${slot.student.voornaam || ''} ${slot.student.achternaam || ''})` :
                                    slot.status === 'open' ? 'Open' :
                                      slot.status === 'afgekeurd' ? 'Afgekeurd' :
                                        slot.status
                                }
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">Geen individuele slots gedefinieerd.</p>
                      )}
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