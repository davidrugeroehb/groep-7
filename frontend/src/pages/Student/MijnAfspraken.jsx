import React, { useEffect, useState } from "react";
import './SpeedDates.css';

function MijnAfspraken() {
  const [afspraken, setAfspraken] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem("userId"); // Haal student ID op

  useEffect(() => {
    const fetchAfspraken = async () => {
      if (!studentId) {
        setError("Je bent niet ingelogd als student.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Gebruik het endpoint voor student specifieke afspraken
        const res = await fetch(`http://localhost:4000/api/aanvragen/afspraken/student/${studentId}`);

        if (!res.ok) {
          throw new Error("Kan afspraken niet ophalen.");
        }

        const data = await res.json();
        setAfspraken(data);
      } catch (err) {
        console.error("Fout bij het ophalen van student afspraken:", err);
        setError("Fout bij het ophalen van afspraken.");
      } finally {
        setLoading(false);
      }
    };

    fetchAfspraken();
  }, [studentId]); // Herlaad bij wijziging van studentId

  if (loading) {
    return <div className="text-center py-10">Laden van afspraken...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
      <header className="header">
        <h1 className="speeddates__title">Mijn afspraken</h1>
        <p className="speeddates__subtitle">Hier zie je alle bevestigde speeddate-afspraken:</p>
      </header>

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
                {/* AANGEPAST: Toon de specifieke slot tijd en lokaal */}
                <p className="text-gray-700 mb-1">
                  <strong>Tijd:</strong> {afspraak.tijd}
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Lokaal:</strong> {afspraak.lokaal}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MijnAfspraken;