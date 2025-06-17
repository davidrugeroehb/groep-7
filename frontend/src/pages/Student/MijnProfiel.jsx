import React, { useEffect, useState } from 'react';
import './MijnProfiel.css'; 
function MijnProfiel() {
  const [profiel, setProfiel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wijzig, setWijzig] = useState(false);
  const studentId = localStorage.getItem("userId");

  const [editableProfiel, setEditableProfiel] = useState({
    voornaam: '',
    achternaam: '',
    email: '',
    gsm: '',
    opleiding: '',
    specialisatie: '',
    talen: [], // Dit is de array die naar de backend gaat
    talenInput: '', // Dit is de string voor het input veld
  });

  const toegestaneTalen = ['Nederlands', 'Frans', 'Engels']; // Definieer toegestane talen hier

  useEffect(() => {
    const fetchProfiel = async () => {
      const role = localStorage.getItem("role");
      if (role !== "student" || !studentId) {
        setError("Je bent niet ingelogd als student of student ID ontbreekt.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // AANGEPAST: Correcte route met '/api/students'
        const res = await fetch(`http://localhost:4000/api/students/mijnprofiel/${studentId}`);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Profiel ophalen mislukt.");
        }

        const data = await res.json();
        setProfiel(data.profile);
        setEditableProfiel({
          voornaam: data.profile.voornaam || '',
          achternaam: data.profile.achternaam || '',
          email: data.profile.email || '',
          gsm: data.profile.gsm || '',
          opleiding: data.profile.opleiding || '',
          specialisatie: data.profile.specialisatie || '',
          talen: Array.isArray(data.profile.talen) ? data.profile.talen : [],
          talenInput: Array.isArray(data.profile.talen) ? data.profile.talen.join(', ') : '',
        });
      } catch (err) {
        console.error("Fout bij ophalen van je profiel:", err);
        setError("Fout bij ophalen van je profiel.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiel();
  }, [studentId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "talenInput") {
      setEditableProfiel((prev) => ({
        ...prev,
        talenInput: value,
        talen: value.split(',').map(t => t.trim()).filter(t => t !== '')
      }));
    } else {
      setEditableProfiel((prev) => ({ ...prev, [name]: value }));
    }
  };

  const OpslaanBewerk = async () => {
    if (!studentId) {
      alert("Student ID ontbreekt. Kan profiel niet opslaan.");
      return;
    }
    if (!/^\d*$/.test(editableProfiel.gsm)) {
      alert("GSM-nummer mag alleen uit cijfers bestaan.");
      return;
    }

    // Controleer op ongeldige talen
    const ongeldigeTalen = editableProfiel.talen.filter(
      taal => !toegestaneTalen.includes(taal)
    );

    if (ongeldigeTalen.length > 0) {
      alert(`De volgende talen zijn niet toegestaan: ${ongeldigeTalen.join(', ')}`);
      return;
    }

    // Maak een object aan om naar de backend te sturen
    const dataToSend = {
      voornaam: editableProfiel.voornaam,
      achternaam: editableProfiel.achternaam,
      email: editableProfiel.email, // Kan disabled zijn in UI, maar hier wel meenemen
      gsm: editableProfiel.gsm,
      opleiding: editableProfiel.opleiding,
      specialisatie: editableProfiel.specialisatie,
      talen: editableProfiel.talen, // Stuur de array van talen
      // Voeg hier andere velden toe die naar de backend moeten
    };

    try {
      // AANGEPAST: Correcte route met '/api/students'
      const res = await fetch(`http://localhost:4000/api/students/mijnprofiel/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Stuur het gefilterde object
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Opslaan mislukt");
      }

      alert(data.message);
      setProfiel(data.profile); // Backend stuurt waarschijnlijk het bijgewerkte profiel terug
      setWijzig(false);
    } catch (err) {
      console.error("Fout bij opslaan van profiel:", err);
      alert(`Fout bij opslaan van profiel: ${err.message || "Onbekende fout"}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Profiel wordt geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const inputStyle = 'bg-white border border-gray-300 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full';

  return (
    <div className="profiel-container">
      <div className="profiel-header">
        <h1 className="speeddates__title">Mijn Profiel</h1>
        <p className="speeddates__subtitle">Beheer je persoonlijke gegevens</p>
      </div>
  
      <div className="profiel-main">
        {/* Accountgegevens Card */}
        <div className="profiel-card">
          <div className="profiel-card-header">
            <h2>Accountgegevens</h2>
          </div>
          
          <div className="profiel-info-list"> {/* Changed from grid to list */}
            {wijzig ? (
              <>
                <div className="profiel-info-item">
                  <label>Voornaam</label>
                  <input
                    type="text"
                    name="voornaam"
                    value={editableProfiel.voornaam}
                    onChange={handleEditChange}
                    className="profiel-input"
                  />
                </div>
                
                <div className="profiel-info-item">
                  <label>Achternaam</label>
                  <input
                    type="text"
                    name="achternaam"
                    value={editableProfiel.achternaam}
                    onChange={handleEditChange}
                    className="profiel-input"
                  />
                </div>
                
                <div className="profiel-info-item">
                  <label>E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={editableProfiel.email}
                    onChange={handleEditChange}
                    className="profiel-input"
                    disabled
                  />
                </div>
                
                <div className="profiel-info-item">
                  <label>GSM nummer</label>
                  <input
                    type="text"
                    name="gsm"
                    value={editableProfiel.gsm}
                    onChange={handleEditChange}
                    className="profiel-input"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="profiel-info-item">
                  <label>Voornaam</label>
                  <p>{profiel.voornaam}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>Achternaam</label>
                  <p>{profiel.achternaam}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>E-mail</label>
                  <p>{profiel.email}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>GSM nummer</label>
                  <p>{profiel.gsm || 'N.v.t.'}</p>
                </div>
              </>
            )}
          </div>
        </div>
  
        {/* Academiegegevens Card */}
        <div className="profiel-card">
          <div className="profiel-card-header">
            <h2>Academiegegevens</h2>
          </div>
          
          <div className="profiel-info-list"> {/* Changed from grid to list */}
            {wijzig ? (
              <>
                <div className="profiel-info-item">
                  <label>Opleiding</label>
                  <input
                    type="text"
                    name="opleiding"
                    value={editableProfiel.opleiding}
                    onChange={handleEditChange}
                    className="profiel-input"
                  />
                </div>
                
                <div className="profiel-info-item">
                  <label>Specialisatie</label>
                  <input
                    type="text"
                    name="specialisatie"
                    value={editableProfiel.specialisatie}
                    onChange={handleEditChange}
                    className="profiel-input"
                  />
                </div>
                
                <div className="profiel-info-item">
                  <label>Talen (komma gescheiden)</label>
                  <input
                    type="text"
                    name="talenInput"
                    value={editableProfiel.talenInput}
                    onChange={handleEditChange}
                    className="profiel-input"
                    placeholder="Nederlands, Engels, Frans"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="profiel-info-item">
                  <label>Opleiding</label>
                  <p>{profiel.opleiding}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>Specialisatie</label>
                  <p>{profiel.specialisatie || 'N.v.t.'}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>Talen</label>
                  <p>{(profiel.talen && profiel.talen.length > 0) ? profiel.talen.join(', ') : 'N.v.t.'}</p>
                </div>
              </>
            )}
          </div>
        </div>
  
        {/* Actie Knoppen */}
        <div className="profiel-actions">
          {wijzig ? (
            <>
              <button
                onClick={OpslaanBewerk}
                className="profiel-btn profiel-btn-success"
              >
                <i className="fas fa-save mr-2"></i> Opslaan
              </button>
              <button
                onClick={() => setWijzig(false)}
                className="profiel-btn profiel-btn-secondary"
              >
                <i className="fas fa-times mr-2"></i> Annuleren
              </button>
            </>
          ) : (
            <button
              onClick={() => setWijzig(true)}
              className="profiel-btn profiel-btn-primary"
            >
              <i className="fas fa-edit mr-2"></i> Profiel Bewerken
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MijnProfiel;