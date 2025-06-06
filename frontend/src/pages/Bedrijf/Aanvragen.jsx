import React, { useEffect, useState } from "react";

function Aanvragen() {
  const [aanvragen, setAanvragen] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAanvragen = async () => {
      try {
        const token = localStorage.getItem("bedrijfToken");

        const res = await fetch("http://localhost:4000/api/bedrijf/aanvragen", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Fout bij ophalen van aanvragen.");

        const data = await res.json();
        setAanvragen(data);
      } catch (err) {
        console.error(err);
        setError("Kon aanvragen niet laden.");
      }
    };

    fetchAanvragen();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/bedrijf/aanvragen/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("bedrijfToken")}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error("Update mislukt");

      setAanvragen((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: status } : a
        )
      );
    } catch (err) {
      console.error(err);
      alert("Fout bij bijwerken van aanvraag.");
    }
  };

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
                <th className="py-3 px-4">Tijdslot</th>
                <th className="py-3 px-4">Studentnaam</th>
                <th className="py-3 px-4">Focus</th>
                <th className="py-3 px-4">Opleiding</th>
                <th className="py-3 px-4">Taal</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {aanvragen.map((a) => (
                <tr key={a._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{a.tijd || "—"}</td>
                  <td className="py-2 px-4">{a.student?.naam || "Onbekend"}</td>
                  <td className="py-2 px-4">{a.focus}</td>
                  <td className="py-2 px-4">{a.student?.opleiding}</td>
                  <td className="py-2 px-4">{a.taal}</td>
                  <td className="py-2 px-4">
                    {a.status === "in behandeling" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(a._id, "goedgekeurd")}
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
                    ) : a.status === "goedgekeurd" ? (
                      <span className="text-green-700 font-medium">Geaccepteerd</span>
                    ) : (
                      <span className="text-red-700 font-medium">Geweigerd</span>
                    )}
                  </td>
                </tr>
              ))}
              {aanvragen.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Geen aanvragen gevonden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Aanvragen;
