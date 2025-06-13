import React, { useEffect, useState } from 'react';

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Bedrijfsprofiel</h1>

        <div className="space-y-6 text-gray-700">
          {/* Bedrijfsgegevens */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Bedrijfsgegevens:</h2>
            {wijzig ? (
              <>
                {[
                  { label: "Naam:", name: "name", type: "text" },
                  { label: "Adres:", name: "adres", type: "text" },
                  { label: "BTW-nummer:", name: "btwNummer", type: "text" },
                  { label: "Website:", name: "website", type: "text" },
                  { label: "Sector:", name: "sector", type: "text" },
                  { label: "Contactpersoon:", name: "contactpersoon", type: "text" },
                  { label: "E-mail:", name: "email", type: "email", disabled: true }, // E-mail vaak niet direct bewerkbaar
                  { label: "Telefoon:", name: "phone", type: "text" },
                ].map((field) => (
                  <div key={field.name} className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={editableProfiel[field.name]}
                      onChange={handleEditChange}
                      className={inputStyle}
                      disabled={field.disabled || false}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                <p><strong>Naam:</strong> {profiel.name}</p>
                <p><strong>Adres:</strong> {profiel.adres || 'N.v.t.'}</p>
                <p><strong>BTW-nummer:</strong> {profiel.btwNummer || 'N.v.t.'}</p>
                <p><strong>Website:</strong> {profiel.website || 'N.v.t.'}</p>
                <p><strong>Sector:</strong> {profiel.sector || 'N.v.t.'}</p>
                <p><strong>Contactpersoon:</strong> {profiel.contactpersoon}</p>
                <p><strong>E-mail:</strong> {profiel.email}</p>
                <p><strong>Telefoon:</strong> {profiel.phone || 'N.v.t.'}</p>
              </>
            )}
          </div>

          {/* Bewerken/Opslaan/Annuleren knoppen */}
          <div className="text-right mt-4">
            {wijzig ? (
              <div className="flex justify-end gap-2">
                <button
                  onClick={OpslaanBewerk}
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
                >
                  Opslaan
                </button>
                <button
                  onClick={() => setWijzig(false)}
                  className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition"
                >
                  Annuleren
                </button>
              </div>
            ) : (
              <button
                onClick={() => setWijzig(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
              >
                Profiel Bewerken
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BedrijfProfiel;