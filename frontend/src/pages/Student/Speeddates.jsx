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
  const [expandedId, setExpandedId] = useState(null); // ID of the main speeddate being expanded
  const [selectedSlot, setSelectedSlot] = useState(null); // NEW: To store the selected sub-speeddate slot
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
        const res = await fetch("http://localhost:4000/api/speeddates"); // Adjusted endpoint to fetch all speeddates with their slots
        if (!res.ok) {
          throw new Error("Kon speeddates niet ophalen.");
        }
        const data = await res.json();
        // Assuming data.speeddates will now include 'slots' array
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
    setSelectedSlot(null); // Reset selected slot when collapsing/expanding
  };

  const handleApply = async (mainSpeeddateId) => {
    if (!studentId) {
      alert("Log in als student om een afspraak aan te vragen.");
      return;
    }

    if (!selectedSlot) {
      alert("Selecteer een tijdslot om aan te vragen.");
      return;
    }

    if (!window.confirm(`Weet je zeker dat je het slot van ${selectedSlot.startTime} - ${selectedSlot.endTime} wilt aanvragen?`)) {
      return;
    }

    try {
      // Send both the main speeddate ID and the specific slot ID
      const res = await fetch("http://localhost:4000/api/aanvragen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          speeddateId: mainSpeeddateId, // Main speeddate ID
          slotId: selectedSlot._id, // NEW: The specific slot ID
          studentId: studentId
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Aanvraag mislukt.");
      }

      alert(data.message);
      // Update the local state to reflect the applied slot status
      setSpeedDates(prevDates =>
        prevDates.map(date => {
          if (date._id === mainSpeeddateId) {
            return {
              ...date,
              // Update the specific slot within the main speeddate
              slots: date.slots.map(slot =>
                slot._id === selectedSlot._id ? { ...slot, status: 'aangevraagd', student: studentId } : slot
              )
            };
          }
          return date;
        })
      );
      setSelectedSlot(null); // Clear selected slot after successful application
      setExpandedId(null); // Optionally collapse the card after applying
    } catch (err) {
      console.error("Fout bij aanvragen:", err);
      alert(`Fout bij het aanvragen: ${err.message || "Onbekende fout"}`);
    }
  };

  // Check if student has already applied for ANY slot within this main speeddate
  const hasAppliedForThisMainSpeeddate = (mainSpeeddate) => {
    return mainSpeeddate.slots.some(slot => slot.student === studentId);
  };

  const getSlotStatusText = (slot, mainSpeeddate) => {
    if (slot.status === 'aangevraagd' && slot.student === studentId) {
      return 'Reeds aangevraagd door jou';
    }
    if (slot.status === 'bevestigd' && slot.student === studentId) {
      return 'Afspraak bevestigd (jouw slot)';
    }
    if (slot.status === 'bevestigd' && slot.student !== studentId) {
      return 'Afspraak bevestigd (ander student)';
    }
    if (slot.status === 'aangevraagd' && slot.student !== studentId) {
      return 'Reeds aangevraagd door een andere student';
    }
    if (hasAppliedForThisMainSpeeddate(mainSpeeddate)) {
        return 'Al een slot aangevraagd in deze speeddate'; // If student has applied for any slot in this main speeddate
    }
    return 'Beschikbaar';
  };

  const getApplyButtonText = (slot, mainSpeeddate) => {
      if (slot.status === 'aangevraagd' && slot.student === studentId) return 'Reeds aangevraagd door jou';
      if (slot.status === 'bevestigd') return 'Afspraak bevestigd';
      if (slot.status === 'aangevraagd') return 'Aangevraagd door een ander';
      if (hasAppliedForThisMainSpeeddate(mainSpeeddate)) return 'Al een slot aangevraagd';
      return 'Afspraak aanvragen';
  };

  const isSlotDisabled = (slot, mainSpeeddate) => {
    // Disable if slot is not open
    if (slot.status !== 'open') return true;
    // Disable if student has already applied for any slot in this main speeddate
    if (hasAppliedForThisMainSpeeddate(mainSpeeddate)) return true;
    // Disable if no slot is selected OR if a different slot is selected
    return !selectedSlot || selectedSlot._id !== slot._id;
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
              <button className="apply-btn" onClick={applyFilters}>Filters toepassen</button>
              <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
            </div>
          </div>
        )}

        <div className="results-section">
          <h2>Beschikbare Speeddates <span className="result-count">({filteredAndSortedDates.length})</span></h2>

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
                    <div className="expanded-details mt-4 p-3 border-t border-gray-200">
                      <h4 className="font-semibold text-lg mb-2">Beschikbare Tijdslots:</h4>
                      {date.slots && date.slots.length > 0 ? (
                        <div className="space-y-2">
                          {date.slots.map(slot => (
                            <label key={slot._id} className={`flex items-center p-2 rounded-md border cursor-pointer
                              ${slot.status === 'open' && !hasAppliedForThisMainSpeeddate(date) ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-gray-100 border-gray-200 cursor-not-allowed'}
                              ${selectedSlot?._id === slot._id ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}>
                              <input
                                type="radio"
                                name={`slot-${date._id}`} // Unique name for each main speeddate
                                value={slot._id}
                                checked={selectedSlot?._id === slot._id}
                                onChange={() => setSelectedSlot(slot)}
                                disabled={slot.status !== 'open' || hasAppliedForThisMainSpeeddate(date)}
                                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                              />
                              <span className="ml-3 text-sm font-medium text-gray-800">
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold
                                ${slot.status === 'open' && !hasAppliedForThisMainSpeeddate(date) ? 'bg-green-100 text-green-800' :
                                  (slot.status === 'aangevraagd' && slot.student === studentId) ? 'bg-yellow-100 text-yellow-800' :
                                  (slot.status === 'bevestigd' && slot.student === studentId) ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'}`}>
                                {getSlotStatusText(slot, date)}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Geen individuele tijdslots beschikbaar.</p>
                      )}

                      <div className="mt-4">
                        <button
                          className="apply-now-btn w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleApply(date._id)}
                          disabled={!selectedSlot || hasAppliedForThisMainSpeeddate(date)} // Disable if no slot selected or already applied for this main speeddate
                        >
                          {hasAppliedForThisMainSpeeddate(date) ? 'Al een slot aangevraagd in deze speeddate' : (selectedSlot ? `Vraag ${selectedSlot.startTime} aan` : 'Selecteer een slot om aan te vragen')}
                        </button>
                      </div>
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