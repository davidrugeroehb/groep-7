import React, { useEffect, useState, useMemo } from "react";

function StudentenZoeken() {
  const [studenten, setStudenten] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOpleiding, setSelectedOpleiding] = useState("");
  const [selectedSpecialisatie, setSelectedSpecialisatie] = useState("");
  const [selectedTalen, setSelectedTalen] = useState([]); // Aangepast: nu een array voor meerdere talen
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudenten = async () => {
      try {
        setLoading(true); // Zet loading op true bij start van fetch
        const res = await fetch("http://localhost:4000/api/student/studenten", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bedrijfToken")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Fout bij ophalen van studenten.");
        }

        const data = await res.json();
        setStudenten(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Kan studenten niet ophalen.");
      } finally {
        setLoading(false); // Zet loading op false ongeacht succes of fout
      }
    };

    fetchStudenten();
  }, []);

  //Filter

  // Gebruik useMemo om unieke opleidingen te cachen. Dit voorkomt onnodige herberekeningen.
  const uniekeOpleidingen = useMemo(() => {
    const opleidingen = studenten.map((s) => s.opleiding);
    // Filter lege/null waarden en sorteer alfabetisch
    return [...new Set(opleidingen)].filter(Boolean).sort();
  }, [studenten]);

  // Gebruik useMemo om unieke specialisaties te cachen.
  const uniekeSpecialisaties = useMemo(() => {
    const specialisaties = studenten.map((s) => s.specialisatie);
    // Filter lege/null waarden en sorteer alfabetisch
    return [...new Set(specialisaties)].filter(Boolean).sort();
  }, [studenten]);

  // Haal alle unieke talen op uit de studenten data
  const uniekeTalen = useMemo(() => {
    const talenVerzameling = new Set();
    studenten.forEach((s) => {
      // Ga ervan uit dat s.talen een komma-gescheiden string is of een array.
      // Als het een string is, splits deze dan.
      if (typeof s.talen === 'string' && s.talen) {
        s.talen.split(',').map(t => t.trim()).filter(Boolean).forEach(taal => talenVerzameling.add(taal));
      } else if (Array.isArray(s.talen)) {
        s.talen.filter(Boolean).forEach(taal => talenVerzameling.add(taal.trim()));
      }
    });
    return [...talenVerzameling].sort();
  }, [studenten]);

  // Functie om geselecteerde talen bij te werken bij checkbox klik
  const handleTaalChange = (event) => {
    const taal = event.target.value;
    if (selectedTalen.includes(taal)) {
      // Als de taal al geselecteerd is, verwijder deze
      setSelectedTalen(selectedTalen.filter((t) => t !== taal));
    } else {
      // Anders, voeg de taal toe
      setSelectedTalen([...selectedTalen, taal]);
    }
  };

  // Filter de studentenlijst op basis van de geselecteerde filters
  const filteredStudenten = useMemo(() => {
    return studenten.filter((s) => {
      const matchOpleiding = selectedOpleiding
        ? s.opleiding === selectedOpleiding
        : true;
      const matchSpecialisatie = selectedSpecialisatie
        ? s.specialisatie === selectedSpecialisatie
        : true;

      // Filter voor talen:
      // Als geen talen zijn geselecteerd OF
      // als de student ten minste één van de geselecteerde talen spreekt
      const studentTalen = [];
      if (typeof s.talen === 'string' && s.talen) {
        studentTalen.push(...s.talen.split(',').map(t => t.trim()).filter(Boolean));
      } else if (Array.isArray(s.talen)) {
        studentTalen.push(...s.talen.map(t => t.trim()).filter(Boolean));
      }

      const matchTalen = selectedTalen.length === 0 ||
        selectedTalen.some(selectedTaal => studentTalen.includes(selectedTaal));

      return matchOpleiding && matchSpecialisatie && matchTalen;
    });
  }, [studenten, selectedOpleiding, selectedSpecialisatie, selectedTalen]); // selectedTalen toevoegen aan dependencies

  //Weergeven op scherm

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Studenten zoeken
        </h1>

        {error && (
          <p className="text-center text-red-600 font-medium mb-6">{error}</p>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Studenten worden geladen...</p>
        ) : studenten.length === 0 && !error ? (
          <p className="text-center text-gray-500">
            Er zijn momenteel geen studenten beschikbaar om te filteren.
          </p>
        ) : (
          <>
            {/* Filter Controls */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="opleiding-filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Filter op Opleiding:
                </label>
                <select
                  id="opleiding-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                  value={selectedOpleiding}
                  onChange={(e) => setSelectedOpleiding(e.target.value)}
                >
                  <option value="">Alle opleidingen</option>
                  {uniekeOpleidingen.map((opleiding) => (
                    <option key={opleiding} value={opleiding}>
                      {opleiding}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="specialisatie-filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Filter op Specialisatie:
                </label>
                <select
                  id="specialisatie-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                  value={selectedSpecialisatie}
                  onChange={(e) => setSelectedSpecialisatie(e.target.value)}
                >
                  <option value="">Alle specialisaties</option>
                  {uniekeSpecialisaties.map((specialisatie) => (
                    <option key={specialisatie} value={specialisatie}>
                      {specialisatie}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nieuw filter voor Talen - Checkboxes */}
              <div className="col-span-1 md:col-span-1">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Filter op Talen:
                </span>
                <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                  {uniekeTalen.map((taal) => (
                    <div key={taal} className="flex items-center">
                      <input
                        id={`taal-${taal}`}
                        name="taal-filter"
                        type="checkbox"
                        value={taal}
                        checked={selectedTalen.includes(taal)}
                        onChange={handleTaalChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor={`taal-${taal}`} className="ml-2 text-gray-700">
                        {taal}
                      </label>
                    </div>
                  ))}
                </div>
                {/* Knop om alle talen te deselecteren */}
                {selectedTalen.length > 0 && (
                  <button
                    onClick={() => setSelectedTalen([])}
                    className="mt-2 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Deselecteer alle talen
                  </button>
                )}
              </div>
            </div>

            {filteredStudenten.length === 0 &&
              (selectedOpleiding || selectedSpecialisatie || selectedTalen.length > 0) ? (
              <p className="text-center text-gray-500">
                Geen studenten gevonden met de geselecteerde filters.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredStudenten.map((s) => (
                  <div
                    key={s._id}
                    className="bg-gray-100 rounded-xl p-6 shadow border border-gray-300"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                      {s.voornaam} {s.achternaam}
                    </h2>
                    <p className="text-gray-700">
                      <strong>Email:</strong> {s.email}
                    </p>
                    <p className="text-gray-700">
                      <strong>Opleiding:</strong> {s.opleiding}
                    </p>
                    <p className="text-gray-700">
                      <strong>Specialisatie:</strong>{" "}
                      {s.specialisatie || "—"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Talen:</strong> {s.talen || "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StudentenZoeken;