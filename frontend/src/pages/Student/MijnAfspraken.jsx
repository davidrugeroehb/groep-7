import React, { useEffect, useState } from "react";

function MijnAfspraken() {
  const [afspraken, setAfspraken] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAfspraken = async () => {
      const role = localStorage.getItem("role");
      if (role !== "student") {
        setError("Je bent niet ingelogd als student.");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/student/afspraken");

        if (!res.ok) {
          throw new Error("Kan afspraken niet ophalen.");
        }

        const data = await res.json();
        setAfspraken(data);
      } catch (err) {
        console.error(err);
        setError("Fout bij het ophalen van afspraken.");
      }
    };

    fetchAfspraken();
  }, []);

  const annuleerAfspraak = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/student/afspraken/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Verwijderen mislukt.");
      }

      setAfspraken((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Annuleren mislukt.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Mijn afspraken
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Hier zie je alle bevestigde speeddate-afspraken:
        </p>

        {error && (
          <p className="text-center text-red-600 mb-6">{error}</p>
        )}

        {!error && afspraken.length === 0 ? (
          <p className="text-center text-gray-500">
            Je hebt momenteel geen afspraken.
          </p>
        ) : (
          <div className="grid gap-6">
            {afspraken.map((afspraak) => (
              <div
                key={afspraak._id}
                className="bg-white shadow-md rounded-xl p-6 border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-blue-600 mb-2">
                  {afspraak.bedrijfNaam}
                </h2>
                <p className="text-gray-700 mb-1">
                  <strong>Focus:</strong> {afspraak.focus}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Tijd:</strong> {afspraak.tijd}
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Lokaal:</strong> {afspraak.lokaal}
                </p>
                <button
                  onClick={() => annuleerAfspraak(afspraak._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                  Annuleer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MijnAfspraken;


