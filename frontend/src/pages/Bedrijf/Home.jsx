import React, { useState } from 'react';

const HomeBedrijf = () => {
  const [filters, setFilters] = useState({
    sector: [],
    type: [],
    taal: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  
  const speedDates = [
    {
      id: 1,
  bedrijf: "TechSolutions",
  sector: "Web Development",
  type: "Stage",
  taal: "Nederlands",
  uur: "10:00 - 10:20",
  beschrijving: "Stageplek voor front-end development met React. Wij zoeken een gemotiveerde stagiair die ons team komt versterken in het ontwikkelen van moderne webapplicaties.",
  details: "Locatie: Amsterdam | Vereisten: Basiskennis HTML/CSS/JavaScript"
    },
    {
      id: 2,
      bedrijf: "SecureIT",
      sector: "Cybersecurity",
      type: "Afstudeerproject",
      taal: "Engels",
      uur: "10:30 - 10:50",
      beschrijving: "Onderzoek naar nieuwe cybersecurity threats en ontwikkelen van preventieve maatregelen.",
      details: "Locatie: Rotterdam | Begeleiding: 1x per week"
    },
    {
      id: 3,
      bedrijf: "AI Minds",
      sector: "AI / Machine Learning",
      type: "Bijbaan / Werkstudent",
      taal: "Engels",
      uur: "11:00 - 11:20",
      beschrijving: "AI Minds ontwikkelt toepassingen met machine learning en data-analyse. Werk aan innovatieve AI oplossingen.",
      details: "Flexibele uren | Thuiswerk mogelijk"
    },
    {
      id: 4,
      bedrijf: "CloudExperts",
      sector: "DevOps",
      type: "Stage",
      taal: "Spaans",
      uur: "11:30 - 11:50",
      beschrijving: "DevOps stage met focus op cloud infrastructure en CI/CD pipelines.",
      details: "Duur: 6 maanden | Vergoeding: €500 p/m"
    },
    {
      id: 5,
      bedrijf: "DesignHub",
      sector: "UX/UI",
      type: "Bijbaan / Werkstudent",
      taal: "Portugees",
      uur: "12:00 - 12:20",
      beschrijving: "UI design voor internationale klanten in een creatief team.",
      details: "16-24 uur per week | Creatieve vrijheid"
    }
  ];
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
      type: [],
      taal: []
    });
  };
  
  const applyFilters = () => {
    setShowFilters(false);
  };
  
  const filteredDates = speedDates.filter(date => {
    return (
      (filters.sector.length === 0 || filters.sector.includes(date.sector)) &&
      (filters.type.length === 0 || filters.type.includes(date.type)) &&
      (filters.taal.length === 0 || filters.taal.includes(date.taal))
    );
  });
  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };


  return (
    <div className="speeddates-container">
      <header className="header">
        <h1 className="speeddates__title">Speeddates</h1>
        <p className="speeddates__subtitle">Speeddates beheer</p>
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
  <h3> "Sector / Focus</h3>
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
                      checked={filters.type.includes(type)}
                      onChange={() => handleFilterChange('type', type)}
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
                <div key={date.id} className="speeddate-card">
                  <div className="card-header">
                    <h3>{date.bedrijf}</h3>
                    <span className={`sector-tag ${date.sector.replace(/[^a-zA-Z]/g, '')}`}>{date.sector}</span>
                  </div>
                  <div className="card-body">
                    <p><i className="far fa-clock"></i> {date.uur}</p>
                    <p><i className="far fa-user"></i> {date.type}</p>
                    <p><i className="fas fa-language"></i> {date.taal}</p>
                    <p className="description">{date.beschrijving}</p>
                  </div>
                  <div className="card-footer">
                    <button
                      className="details-btn"
                      onClick={() => toggleDetails(date.id)}
                    >
                      {expandedId === date.id ? 'Minder details' : 'Bekijk meer'}
                    </button>
                  </div>
                 
                  {expandedId === date.id && (
                    <div className="expanded-details">
                      <h4>Meer informatie</h4>
                      <p>{date.details}</p>
                      <button
                        className="apply-now-btn"
                        onClick={() => alert(`Sollicitatie gestuurd naar ${date.bedrijf}`)}
                      >
                        Afspraak aanvragen
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


export default HomeBedrijf;