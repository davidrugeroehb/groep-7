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

      </div>
    </div>
  );
};

export default SpeedDates;
