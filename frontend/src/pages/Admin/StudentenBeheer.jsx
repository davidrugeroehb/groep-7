import React, { useEffect, useState } from "react";

function StudentenBeheer() {
  const [studenten, setStudenten] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const verwijderStudent = (id) => {
    setStudenten((prev) => prev.filter((s) => s._id !== id));
  };

  useEffect(() => {
    const fetchStudenten = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/studenten");

        if (!res.ok) throw new Error("Fout bij ophalen van studenten.");
        const data = await res.json();
        setStudenten(data);
      } catch (err) {
        console.error(err);
        setError("Kan studenten niet ophalen.");
      }
    };
    fetchStudenten();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8 border">
        <h1 className="text-3xl font-bold text-center mb-8">Studenten beheren</h1>

        {error && <p className="text-center text-red-600 mb-6">{error}</p>}

        {studenten.length === 0 && !error ? (
          <p className="text-center text-gray-500">Er zijn momenteel geen studenten beschikbaar.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {studenten.map((s) => (
              <div key={s._id} className="bg-gray-100 p-6 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-1">
                  {s.voornaam} {s.achternaam}
                </h2>
                <Info label="Email" value={s.email} />
                <Info label="Opleiding" value={s.opleiding} />
                <Info label="Specialisatie" value={s.specialisatie || "—"} />
                <Info label="Talen" value={s.talen || "—"} />

                <div className="mt-4 flex gap-3">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => setSelected(s)}
                  >
                    Geplande speeddates
                  </button>
                  <button
                    className="bg-orange-600 text-white px-3 py-1 rounded"
                    onClick={() => verwijderStudent(s._id)}
                  >
                    Verwijder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">
              Speeddates van {selected.voornaam}
            </h3>

            {!selected.speeddates || selected.speeddates.length === 0 ? (
              <p className="text-gray-600">Geen speeddates geboekt.</p>
            ) : (
              <ul className="space-y-2">
                {selected.speeddates.map((sd) => (
                  <li
                    key={sd.id || sd._id}
                    className="flex justify-between bg-gray-100 px-3 py-2 rounded"
                  >
                    <span>{sd.bedrijf?.naam || "Onbekend"}</span>
                    <span className="font-semibold">{sd.tijd || "-"}</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setSelected(null)}
              className="mt-6 bg-gray-700 text-white px-4 py-1 rounded w-full"
            >
              Sluit Speeddates
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ label, value }) => (
  <p className="text-gray-700">
    <strong>{label}:</strong> {value}
  </p>
);

export default StudentenBeheer;