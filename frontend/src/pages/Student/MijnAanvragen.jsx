import React, { useEffect, useState } from 'react';

function MijnAanvragen() {
  const [aanvragen, setAanvragen] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem("userId"); // Haal student ID op uit localStorage

  useEffect(() => {
    const fetchAanvragen = async () => {
      if (!studentId) {
        setError("Je bent niet ingelogd als student.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:4000/api/aanvragen/student/${studentId}`);

        if (!res.ok) {
          throw new Error("Kon de aanvragen niet ophalen.");
        }

        const data = await res.json();
        setAanvragen(data);
      } catch (err) {
        console.error("Fout bij ophalen van student aanvragen:", err);
        setError("Fout bij ophalen van jouw aanvragen.");
      } finally {
        setLoading(false);
      }
    };

    fetchAanvragen();
  }, [studentId]);

  const annuleerAanvraag = async (id) => {
    if (!window.confirm("Weet u zeker dat u deze aanvraag wilt annuleren?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/aanvragen/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Annuleren mislukt.");
      }

      alert(data.message);
      // Verwijder de aanvraag lokaal uit de lijst
      setAanvragen((prev) => prev.filter((a) => a._id !== id));
      // Optioneel: refresh de speeddates lijst op de speeddates pagina om de status te updaten
      // Dit vereist een manier om de Speeddates component te triggeren, bijv. via Context API of een globale state management.
    } catch (err) {
      console.error("Fout bij annuleren aanvraag:", err);
      alert(`Annuleren mislukt: ${err.message || "Onbekende fout"}`);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Laden van aanvragen...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Mijn Aanvragen</h1>

        {error && <p className="text-center text-red-600 mb-4">{error}</p>}

        {!error && aanvragen.length === 0 ? (
          <p className="text-center text-gray-500">Je hebt nog geen aanvragen ingediend.</p>
        ) : (
          <div className="grid gap-6">
            {aanvragen.map((aanvraag) => (
              <div key={aanvraag._id} className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-blue-600">{aanvraag.bedrijfNaam}</h2>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    aanvraag.status === 'goedgekeurd'
                      ? 'bg-green-100 text-green-800'
                      : aanvraag.status === 'afgekeurd'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {aanvraag.status}
                  </span>
                </div>

                <p className="text-gray-700 mb-2">
                  <strong>Focus:</strong> {aanvraag.focus || "N/B"}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Vakgebied:</strong> {aanvraag.vakgebied || "N/B"}
                </p>
                {/* AANGEPAST: Toon de specifieke slot tijd en lokaal */}
                <p className="text-gray-700 mb-2">
                  <strong>Aangevraagde Tijd:</strong> {aanvraag.afspraakDetails?.tijd || 'N/B'}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Lokaal:</strong> {aanvraag.afspraakDetails?.lokaal || 'N/B'}
                </p>


                {aanvraag.status === "in behandeling" && (
                  <button
                    onClick={() => annuleerAanvraag(aanvraag._id)}
                    className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                  >
                    Annuleer aanvraag
                  </button>
                )}
                 {aanvraag.status === "goedgekeurd" && (
                  <p className="mt-3 text-green-700 font-medium">
                    Afspraak goedgekeurd. Bekijk "Mijn afspraken" voor details.
                  </p>
                )}
                 {aanvraag.status === "afgekeurd" && (
                  <p className="mt-3 text-red-700 font-medium">
                    Aanvraag afgekeurd.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MijnAanvragen;