import React, { useState } from 'react';

function Speeddates() {
  //Dummy data met bedrijven en hun speeddates
  const speeddatesDummy = [
    { id: 1, bedrijf: "TechCorp", sector: "Web Development", type: "Stage", taal: "Nederlands", uur: "10:00 - 10:20",
      beschrijving: "TechCorp is een innovatief webbedrijf dat werkt met React en Node.js.",
    },
    { id: 2, bedrijf: "CyberSecure", sector: "Cybersecurity", type: "Afstudeerproject", taal: "Engels", uur: "10:30 - 10:50", 
      beschrijving: "CyberSecure specialiseert zich in netwerkbeveiliging en ethisch hacken.",
    },
    { id: 3, bedrijf: "AI Minds", sector: "AI / Machine Learning", type: "Bijbaan / Werkstudent", taal: "Engels", uur: "11:00 - 11:20",
      beschrijving: "AI Minds ontwikkelt toepassingen met machine learning en data-analyse.",
    }
    ];

const [selected, setSelected] = useState(null);
const [filters, setFilters] = useState({ sector: [], type: [], taal: [], });
const [showFilters, setShowFilters] = useState(false);
const [resultaten, setResultaten] = useState(speeddatesDummy);
const handleAanvragen = () => {
  alert(`De bedrijf ${selected.bedrijf} heeft je aanvraag gekregen.`);
};

//Beschikbare opties voor filters
  const opties = {
    sector: ['Web Development', 'Cybersecurity', 'AI / Machine Learning'],
    type: ['Stage', 'Afstudeerproject', 'Bijbaan / Werkstudent'],
    taal: ['Nederlands', 'Engels', 'Spaans', 'Duits'],
  };

  // filters aan en uit zetten 
  const toggle = (categorie, waarde) => {
    setFilters((prev) => ({
      ...prev,
      [categorie]: prev[categorie].includes(waarde)
        ? prev[categorie].filter((v) => v !== waarde)
        : [...prev[categorie], waarde],
    }));
  };

  // functie op filters toe te passen op data 
  const toepassenFilter = () => {
    const gefilterd = speeddatesDummy.filter((sd) =>
      ['sector', 'type', 'taal'].every(
        (cat) => filters[cat].length === 0 || filters[cat].includes(sd[cat])
      )
    );
    setResultaten(gefilterd);
    setShowFilters(false);
    setSelected(null); 
  };

return (
  <div style={{ position: 'relative', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1  style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '40px', textTransform: 'uppercase', letterSpacing: '2px' }}>Beschikbare speeddates</h1>
    {/*filterknop*/}
    <button onClick={() => setShowFilters(!showFilters)}
    aria-label = "Filter" 
    style={{
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        padding: '8px 12px',
        cursor: 'pointer',
        color: 'white',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
      > 
      filter
 </button>

 {/*Filterpaneel*/}
  {showFilters && (
  <div style={{ border: '1px solid gray', padding: '10px', margin: '10px 0' }}>
    {/*Filter voor Sector*/}
    <strong>Sector (Focus)</strong><br />
    {opties.sector.map((opt) => (
      <label key={opt} style={{ marginRight: '10px', display: 'block' }}>
        <input
          type="checkbox"
          checked={filters.sector.includes(opt)}
          onChange={() => toggle('sector', opt)}
        />
        {opt}
      </label>
    ))}

{/*Filter voor type*/}
    <br /><strong>Type</strong><br />
    {opties.type.map((opt) => (
      <label key={opt} style={{ marginRight: '10px' }}>
        <input
          type="checkbox"
          checked={filters.type.includes(opt)}
          onChange={() => toggle('type', opt)}
        />
        {opt}
      </label>
    ))}

    {/*Filter voor taal*/}

    <br /><strong>Taal</strong><br />
    {opties.taal.map((opt) => (
      <label key={opt} style={{ marginRight: '10px' }}>
        <input
          type="checkbox"
          checked={filters.taal.includes(opt)}
          onChange={() => toggle('taal', opt)}
        />
        {opt}
      </label>
    ))}

    {/*knop om filters toe te passen*/}
 <br /><button onClick={toepassenFilter} style={{ marginTop: '10px' }}>
      Toepassen
    </button>
  </div>
)}

{/*Resultatenlijst van gefilterde speeddates*/}

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center',  flexGrow: 1 }}>
        {resultaten.map((sd) => (
          <div
            key={sd.id}
            onClick={() => setSelected(sd)}
            style={{
              border: '1px solid black',
              padding: '10px',
              cursor: 'pointer',
              width: '200px',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
              transition: 'transform 0.2s ease',
              textAlign: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
>
            <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>{sd.bedrijf}</h3>
            <p><strong>Sector:</strong> {sd.sector}</p>
            <p><strong>Type:</strong> {sd.type}</p>
            <p><strong>Taal:</strong> {sd.taal}</p>
            <p><strong>Uur:</strong> {sd.uur}</p>
          </div>
        ))}
  </div>

  {/*Detailsweergave van geselecteerde speeddates*/}
  {selected && (
        <div style={{ marginTop: '30px', borderTop: '1px solid gray', paddingTop: '20px' }}>
          <h2>{selected.bedrijf}</h2>
          <p><strong>Sector:</strong> {selected.sector}</p>
          <p><strong>Type:</strong> {selected.type}</p>
          <p><strong>Taal:</strong> {selected.taal}</p>
          <p>{selected.beschrijving}</p>
          <button onClick={() => setSelected(null)}>Sluiten</button>
        </div>
      )}
    </div>
  );
}
export default Speeddates;
