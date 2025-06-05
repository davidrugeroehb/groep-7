// SpeedDates.js
import React, { useState } from 'react';
import './SpeedDates.css';

const SpeedDates = () => {
  const [filters, setFilters] = useState({
    sector: [],
    type: [],
    taal: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);
  
  return (
    <div className="speeddates">
      <header className="speeddates__header">
        <h1 className="speeddates__title">Speeddates</h1>
        <p className="speeddates__subtitle">Vind jouw ideale stage, afstudeerproject of bijbaan</p>
      </header>

      <div className="speeddates__main">
      <button 
  className={`speeddates__filter-toggle ${showFilters ? 'speeddates__filter-toggle--active' : ''}`}
  onClick={() => setShowFilters(!showFilters)}
>
  {showFilters ? 'Filters verbergen' : 'Filters tonen'}
</button>

{showFilters && (
  <div className="speeddates__filter-controls">
    <div className="filter-group">
  <h3 className="filter-group__title">Sector / Focus</h3>
  <div className="filter-group__options">
    {["Web Development", "Cybersecurity"].map((sector) => (
      <label key={sector} className="filter-option">
        <input
          type="checkbox"
          className="filter-option__input"
          checked={filters.sector.includes(sector)}
          onChange={() => handleFilterChange('sector', sector)}
        />
        <span className="filter-option__label">{sector}</span>
      </label>
    ))}
  </div>
</div>
    <div className="speeddates__filter-actions">
      <button className="button button--primary">Filters toepassen</button>
      <button className="button button--secondary">Reset filters</button>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default SpeedDates;
