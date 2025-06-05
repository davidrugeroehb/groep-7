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
  
  const speedDatesData = [
    {
      id: 1,
      company: "TechSolutions",
      sector: "Web Development",
      type: "Stage",
      language: "Nederlands",
      timeSlot: "10:00 - 10:20",
      description: "Stageplek voor front-end development...",
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
