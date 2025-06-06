import React, { useEffect, useState } from 'react';

function MijnAanvragen() {
  const [aanvragen, setAanvragen] = useState([]);
  const [error, setError] = useState(null);

  const isStudent = localStorage.getItem("role") === "student";

  useEffect(() => {
    const fetchAanvragen = async () => {
      if (!isStudent) {
        setError("Je bent niet ingelogd als student.");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/student/aanvragen");

        if (!res.ok) {
          throw new Error("Kon de aanvragen niet ophalen.");
        }

        const data = await res.json();
        setAanvragen(data);
      } catch (err) {
        console.error(err);
        setError("Fout bij ophalen van jouw aanvragen.");
      }
    };

    fetchAanvragen();
  }, [isStudent]);

  const annuleerAanvraag = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/student/aanvragen/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Verwijderen mislukt");
      }

      // verwijder lokaal uit de lijst
      setAanvragen((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Annuleren mislukt.");
    }
  };

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
                  <strong>Sector:</strong> {aanvraag.sector || "N/B"}
                </p>

                {aanvraag.status === "in behandeling" && (
                  <button
                    onClick={() => annuleerAanvraag(aanvraag._id)}
                    className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                  >
                    Annuleer aanvraag
                  </button>
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
