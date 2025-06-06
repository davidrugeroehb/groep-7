import React, { useEffect, useState } from 'react';

function Home() {
  const [speeddates, setSpeeddates] = useState([]);
  const [aanvragenCount, setAanvragenCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('bedrijfToken');

        const [speeddateRes, aanvragenRes] = await Promise.all([
          fetch('http://localhost:4000/api/bedrijf/speeddates', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:4000/api/bedrijf/aanvragen/count', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!speeddateRes.ok || !aanvragenRes.ok) {
          throw new Error('Fout bij ophalen van data.');
        }

        const speeddatesData = await speeddateRes.json();
        const aanvragenData = await aanvragenRes.json();

        setSpeeddates(speeddatesData);
        setAanvragenCount(aanvragenData.count);
      } catch (err) {
        console.error(err);
        setError('Kan speeddates of aanvragen niet ophalen.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Geplande speeddates
        </h1>

        {/* Statistieken */}
        <div className="flex justify-center gap-8 mb-10">
          <div className="bg-red-100 px-6 py-4 rounded-xl text-center shadow">
            <p className="text-xl font-bold text-red-700">{speeddates.length}</p>
            <p className="text-gray-600">Speeddates</p>
          </div>
          <div className="bg-red-100 px-6 py-4 rounded-xl text-center shadow">
            <p className="text-xl font-bold text-red-700">{aanvragenCount}</p>
            <p className="text-gray-600">Aanvragen</p>
          </div>
        </div>

        {/* Foutmelding */}
        {error && (
          <p className="text-center text-red-600 font-medium mb-6">{error}</p>
        )}

        {/* Speeddates */}
        <div className="grid md:grid-cols-2 gap-6">
          {speeddates.map((speeddate) => (
            <div
              key={speeddate._id}
              className="bg-gray-100 rounded-xl p-6 shadow border border-gray-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {speeddate.bedrijfNaam || "Bedrijf"}
              </h2>
              <p className="text-gray-700 mb-1">
                <strong>Focus:</strong> {speeddate.focus}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Tijd:</strong> {speeddate.tijd}
              </p>
              <p className="text-gray-700">
                <strong>Talen:</strong> {speeddate.talen}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
