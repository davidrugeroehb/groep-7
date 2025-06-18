import React, { useEffect, useState } from "react";

function Aanvragen() {
  const [aanvragen, setAanvragen] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const bedrijfId = localStorage.getItem("userId"); // Haal bedrijf ID op uit localStorage
  // showModal, currentAanvraag, afspraakTijd, afspraakLokaal zijn nu verwijderd

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
  }, [bedrijfId]);

  // handleAcceptClick is nu direct
  const handleAcceptClick = async (aanvraagId) => {
    if (window.confirm("Weet u zeker dat u deze aanvraag wilt accepteren?")) {
        // We sturen geen afspraakDetails.tijd/lokaal meer mee, deze komen uit de speeddate.
        // Echter, het afspraakDetails object moet nog steeds worden meegegeven, ook al is het leeg.
        await updateStatus(aanvraagId, "goedgekeurd", {}); // Leeg object voor afspraakDetails
    }
  };

  const updateStatus = async (id, status, afspraakDetails = {}) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/aanvragen/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, afspraakDetails }), // afspraakDetails kan nu leeg zijn
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update mislukt");
      }

      alert(data.message);
      // Update lokaal de aanvragen lijst met de nieuwe status en details
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
    <header className="max-w-6xl mx-auto mb-8 text-center">
      <h1 className="speeddates__title">Aanvragen beheren</h1>
      <p className="speeddates__subtitle">Hier kun je alle aanvragen bekijken en beheren</p>
    </header>
  
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">

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
                          onClick={() => handleAcceptClick(a._id)}
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
        {/* De modal is hier volledig verwijderd */}
      </div>
    </div>
  );
}

export default Aanvragen;
