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
  const [expandedId, setExpandedId] = useState(null);
  
  const speedDates = [
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
  <h3> "Sector / Focus</h3>
  <div className="checkbox-grid">
    {["Web Development", "Cybersecurity", "AI / Machine Learning", "DevOps", "UX/UI"].map((sector) => (
      <label key={sector} className="checkbox-label">
        <input
          type="checkbox"
          checked={filters.sector.includes(sector)}
          onChange={() => handleFilterChange('sector', sector)}
        />
        <span className="checkmark">{sector}</span>
      </label>
    ))}
  </div>
</div>
    <div className="filter-group">
      
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
