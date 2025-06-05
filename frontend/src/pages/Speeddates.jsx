import React, { useState } from 'react';


function Speeddates() {
  const speeddatesDummy = [
    {
      id: 1,
      bedrijf: "TechCorp",
      sector: "Web Development",
      type: "Stage",
      taal: "Nederlands",
    },
    {
      id: 2,
      bedrijf: "CyberSecure",
      sector: "Cybersecurity",
      type: "Afstudeerproject",
      taal: "Engels",},
      {
        id: 3,
        bedrijf: "AI Minds",
        sector: "AI / Machine Learning",
        type: "Bijbaan / Werkstudent",
        taal: "Engels",
        beschrijving: "Machine learning modellen trainen met Python.",
      },
   
    ];


const [selected, setSelected] = useState(null);
const [filters, setFilters] = useState({
  sector: [],
  type: [],
  taal: [],
});
const [resultaten, setResultaten] = useState(speeddatesDummy);

  const opties = {
    sector: ['Web Development', 'Cybersecurity', 'AI / Machine Learning'],
    type: ['Stage', 'Afstudeerproject', 'Bijbaan / Werkstudent'],
    taal: ['Nederlands', 'Engels', 'Spaans', 'Duits'],
  };

return (
  <div>
    <h1>Speeddates</h1>
    <div style={{ display: 'flex', gap: '20px' }}>
        {speeddatesDummy.map((sd) => (
          <div
            key={sd.id}
            onClick={() => setSelected(sd)}
            style={{
              border: '1px solid black',
              padding: '10px',
              cursor: 'pointer',
              width: '200px',
            }}
          >
            <h3>{sd.bedrijf}</h3>
            <p><strong>Sector:</strong> {sd.sector}</p>
            <p><strong>Type:</strong> {sd.type}</p>
            <p><strong>Taal:</strong> {sd.taal}</p>
          </div>
        ))}
  </div>
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
