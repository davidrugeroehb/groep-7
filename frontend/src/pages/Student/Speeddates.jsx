import React, { useEffect, useState } from "react";

function Speeddates() {
  const [speeddates, setSpeeddates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpeeddates = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/student/speeddates");

        if (!res.ok) {
          throw new Error("Fout bij ophalen van speeddates.");
        }

        const data = await res.json();
        setSpeeddates(data);
      } catch (err) {
        console.error(err);
        setError("Er ging iets mis bij het ophalen van de speeddates.");
      }
    };

    fetchSpeeddates();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Beschikbare speeddates!
        </h1>

        {error && (
          <p className="text-center text-red-600 mb-6">{error}</p>
        )}

        {!error && speeddates.length === 0 ? (
          <p className="text-center text-gray-500">Er zijn momenteel geen speeddates beschikbaar.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {speeddates.map((speeddate) => (
              <div
                key={speeddate._id}
                className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                  {speeddate.bedrijfNaam}
                </h2>
                <p className="text-gray-700"><strong>Focus:</strong> {speeddate.focus}</p>
                <p className="text-gray-700"><strong>Tijd:</strong> {speeddate.tijd}</p>
                <p className="text-gray-700 mb-4"><strong>Talen:</strong> {speeddate.talen}</p>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                  onClick={() => alert("Detailpagina nog niet geïmplementeerd")}
                >
                  Bekijk
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Speeddates;
