import React, { useEffect, useState } from "react";

function Aanvragen() {
  const [aanvragen, setAanvragen] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const bedrijfId = localStorage.getItem("userId"); // Haal bedrijf ID op uit localStorage
  const [showModal, setShowModal] = useState(false);
  const [currentAanvraag, setCurrentAanvraag] = useState(null);
  const [afspraakTijd, setAfspraakTijd] = useState("");
  const [afspraakLokaal, setAfspraakLokaal] = useState("");

  useEffect(() => {
    const fetchAanvragen = async () => {
      if (!bedrijfId) {
        setError("Je bent niet ingelogd als bedrijf.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Gebruik het nieuwe endpoint voor bedrijf specifieke aanvragen
        const res = await fetch(`http://localhost:4000/api/aanvragen/bedrijf/${bedrijfId}`);

        if (!res.ok) {
          throw new Error("Fout bij ophalen van aanvragen.");
        }

        const data = await res.json();
        setAanvragen(data);
      } catch (err) {
        console.error("Fout bij ophalen van bedrijf aanvragen:", err);
        setError("Kon aanvragen niet laden.");
      } finally {
        setLoading(false);
      }
    };

    fetchAanvragen();
  }, [bedrijfId]); // Herlaad bij wijziging van bedrijfId

  const handleAcceptClick = (aanvraag) => {
    setCurrentAanvraag(aanvraag);
    setAfspraakTijd(""); // Reset
    setAfspraakLokaal(""); // Reset
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    if (!afspraakTijd || !afspraakLokaal) {
      alert("Vul alstublieft de afspraak tijd en lokaal in.");
      return;
    }
    await updateStatus(currentAanvraag._id, "goedgekeurd", { tijd: afspraakTijd, lokaal: afspraakLokaal });
    setShowModal(false);
    setCurrentAanvraag(null);
  };


  const updateStatus = async (id, status, afspraakDetails = {}) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/aanvragen/${id}`, // PATCH endpoint voor aanvragen
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // Autorizatie token is momenteel niet nodig als je geen middleware gebruikt
            // Authorization: `Bearer ${localStorage.getItem("bedrijfToken")}`,
          },
          body: JSON.stringify({ status, afspraakDetails }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update mislukt");
      }

      alert(data.message);
      // Update lokaal de aanvragen lijst met de nieuwe status
      setAanvragen((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: status, afspraakDetails: afspraakDetails } : a
        )
      );
    } catch (err) {
      console.error("Fout bij bijwerken van aanvraag status:", err);
      alert(`Fout bij bijwerken van aanvraag: ${err.message || "Onbekende fout"}`);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Laden van aanvragen...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Aanvragen beheren
        </h1>

        {error && (
          <p className="text-center text-red-600 font-medium mb-6">{error}</p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4">Tijd Speeddate</th>
                <th className="py-3 px-4">Studentnaam</th>
                <th className="py-3 px-4">Focus</th>
                <th className="py-3 px-4">Opleiding</th>
                <th className="py-3 px-4">Taal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Acties</th>
              </tr>
            </thead>
            <tbody>
              {aanvragen.map((a) => (
                <tr key={a._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{a.speeddateTijd || "—"}</td>
                  <td className="py-2 px-4">{a.studentNaam || "Onbekend"}</td>
                  <td className="py-2 px-4">{a.speeddateFocus || "N/B"}</td>
                  <td className="py-2 px-4">{a.studentOpleiding || "N/B"}</td>
                  <td className="py-2 px-4">{a.studentTaal || "N/B"}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      a.status === 'goedgekeurd' ? 'bg-green-100 text-green-800' :
                      a.status === 'afgekeurd' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {a.status === "in behandeling" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptClick(a)} // Open modal bij accepteren
                          className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                        >
                          Accepteren
                        </button>
                        <button
                          onClick={() => updateStatus(a._id, "afgekeurd")}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                        >
                          Weigeren
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Geen acties</span>
                    )}
                  </td>
                </tr>
              ))}
              {aanvragen.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    Geen aanvragen gevonden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Acceptatie Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Afspraak details</h2>
            <p className="mb-4">Vul de tijd en het lokaal in voor de afspraak met {currentAanvraag?.studentNaam}.</p>
            <div className="mb-4">
              <label htmlFor="afspraakTijd" className="block text-gray-700 text-sm font-bold mb-2">Tijd:</label>
              <input
                type="time"
                id="afspraakTijd"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={afspraakTijd}
                onChange={(e) => setAfspraakTijd(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="afspraakLokaal" className="block text-gray-700 text-sm font-bold mb-2">Lokaal:</label>
              <input
                type="text"
                id="afspraakLokaal"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={afspraakLokaal}
                onChange={(e) => setAfspraakLokaal(e.target.value)}
                placeholder="bv. Lokaal A1.01"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Annuleren
              </button>
              <button
                onClick={handleModalSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Opslaan en Accepteren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Aanvragen;
