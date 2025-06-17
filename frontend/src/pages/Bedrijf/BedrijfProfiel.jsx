import React, { useEffect, useState } from 'react';
import '../student/MijnProfiel.css';


function BedrijfProfiel() {
  const [profiel, setProfiel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wijzig, setWijzig] = useState(false); // State om bewerk-modus te togglen
  const bedrijfId = localStorage.getItem("userId"); // Haal bedrijfs-ID op

  // State voor bewerkbare velden
  const [editableProfiel, setEditableProfiel] = useState({
    name: '',
    adres: '',
    btwNummer: '',
    website: '',
    sector: '',
    contactpersoon: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchProfiel = async () => {
      const role = localStorage.getItem("role");
      if (role !== "bedrijf" || !bedrijfId) {
        setError("Je bent niet ingelogd als bedrijf of bedrijfs-ID ontbreekt.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {

        // AANGEPAST: Correcte route met '/api/bedrijven'
        const res = await fetch(`http://localhost:4000/api/bedrijven/profiel/${bedrijfId}`);


        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Profiel ophalen mislukt.");
        }

        const data = await res.json();
        setProfiel(data.profile);
        // Initialiseer editableProfiel met de opgehaalde data
        setEditableProfiel({
          name: data.profile.name || '',
          adres: data.profile.adres || '',
          btwNummer: data.profile.btwNummer || '',
          website: data.profile.website || '',
          sector: data.profile.sector || '',
          contactpersoon: data.profile.contactpersoon || '',
          email: data.profile.email || '',
          phone: data.profile.phone || '',
        });
      } catch (err) {
        console.error("Fout bij ophalen van je profiel:", err);
        setError("Fout bij ophalen van je profiel.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiel();
  }, [bedrijfId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableProfiel((prev) => ({ ...prev, [name]: value }));
  };

  const OpslaanBewerk = async () => {
    if (!bedrijfId) {
      alert("Bedrijfs-ID ontbreekt. Kan profiel niet opslaan.");
      return;
    }
      if (!/^\d*$/.test(editableProfiel.phone)) {
    alert("Telefoonnummer mag alleen uit cijfers bestaan.");
    return;
    } //checkt als de telefoonnummer alleen bestaat uit cijfer
    try {
      // AANGEPAST: Correcte route met '/api/bedrijven'
      const res = await fetch(`http://localhost:4000/api/bedrijven/profiel/${bedrijfId}`, {
        method: "PUT", // Gebruik PUT om het hele profiel te vervangen
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableProfiel), // Stuur de bewerkbare data
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Opslaan mislukt");
      }

      alert(data.message); // Toon succesbericht
      setProfiel(data.profile); // Update hoofdprofiel state met de bijgewerkte data
      setWijzig(false); // Verlaat de bewerk-modus
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
        <h1 className="speeddates__title">Bedrijfsprofiel</h1>
        <p className="speeddates__subtitle">Beheer uw bedrijfsgegevens</p>
      </div>
  
      <div className="profiel-main">
        <div className="profiel-card">
          <div className="profiel-card-header">
            <h2>Bedrijfsgegevens</h2>
          </div>
          
          <div className="profiel-info-list">
            {wijzig ? (
              <>
                {[
                  { label: "Bedrijfsnaam", name: "name", type: "text" },
                  { label: "Adres", name: "adres", type: "text" },
                  { label: "BTW-nummer", name: "btwNummer", type: "text" },
                  { label: "Website", name: "website", type: "text" },
                  { label: "Sector", name: "sector", type: "text" },
                  { label: "Contactpersoon", name: "contactpersoon", type: "text" },
                  { label: "E-mail", name: "email", type: "email", disabled: true },
                  { label: "Telefoon", name: "phone", type: "text" },
                ].map((field) => (
                  <div key={field.name} className="profiel-info-item">
                    <label>{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={editableProfiel[field.name]}
                      onChange={handleEditChange}
                      className="profiel-input"
                      disabled={field.disabled || false}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="profiel-info-item">
                  <label>Bedrijfsnaam</label>
                  <p>{profiel.name}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>Adres</label>
                  <p>{profiel.adres || 'N.v.t.'}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>BTW-nummer</label>
                  <p>{profiel.btwNummer || 'N.v.t.'}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>Website</label>
                  <p>{profiel.website || 'N.v.t.'}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>Sector</label>
                  <p>{profiel.sector || 'N.v.t.'}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>Contactpersoon</label>
                  <p>{profiel.contactpersoon}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>E-mail</label>
                  <p>{profiel.email}</p>
                </div>
                
                <div className="profiel-info-item">
                  <label>Telefoon</label>
                  <p>{profiel.phone || 'N.v.t.'}</p>
                </div>
              </>
            )}
          </div>
        </div>
  
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

export default BedrijfProfiel;