import React, { useState, useEffect } from "react";

function Aanmaken() {
  const [form, setForm] = useState({
    starttijd: "",
    eindtijd: "",
    // gespreksduur en pauze zijn verwijderd
    vakgebied: "",
    focus: "",
    opportuniteit: [],
    talen: [],
    beschrijving: "",
  });

  const [bedrijfId, setBedrijfId] = useState(null); // State om het bedrijfs-ID op te slaan

  // Haal bedrijfs-ID op uit localStorage wanneer de component wordt geladen
  useEffect(() => {
    const storedBedrijfId = localStorage.getItem('bedrijfId');
    if (storedBedrijfId) {
      setBedrijfId(storedBedrijfId);
    } else {
      console.warn("Bedrijf ID niet gevonden in localStorage. Gelieve in te loggen.");
      // Optioneel: navigeer naar login of toon een foutmelding
      // navigate('/login');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else { // radio buttons (if any) and text inputs
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    // De pauze checkbox heeft nu geen speciale handeling meer nodig omdat deze is verwijderd
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bedrijfId) {
      alert("Kan speeddate niet aanmaken: Bedrijf ID is niet beschikbaar. Log opnieuw in.");
      return;
    }

    try {
      const dataToSend = { ...form, bedrijfId: bedrijfId };

      const res = await fetch("http://localhost:4000/api/bedrijf/speeddates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Aanmaken mislukt");
      }

      alert("Speeddate aangemaakt!");
      // Reset formulier na succesvolle verzending
      setForm({
        starttijd: "",
        eindtijd: "",
        vakgebied: "",
        focus: "",
        opportuniteit: [],
        talen: [],
        beschrijving: "",
      });
    } catch (err) {
      console.error(err);
      alert(`Er ging iets mis bij het aanmaken: ${err.message || "Onbekende fout"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Speeddate aanmaken
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Tijd */}
          <div>
            <h2 className="text-xl font-semibold mb-2">⏰ Tijd</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Starttijd</label>
                <input
                  type="time"
                  name="starttijd"
                  value={form.starttijd}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Eindtijd</label>
                <input
                  type="time"
                  name="eindtijd"
                  value={form.eindtijd}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            {/* Gesprkstijd per student en Pauze inplannen zijn verwijderd */}
            {/* Oude code voor gespreksduur en pauze:
            <div className="mt-4">
              <label className="block font-medium mb-1">
                Gesprekstijd per student
              </label>
              <select
                name="gespreksduur"
                value={form.gespreksduur}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="15">15 min</option>
                <option value="20">20 min</option>
                <option value="30">30 min</option>
              </select>
            </div>

            <label className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                name="pauze"
                checked={form.pauze}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, pauze: e.target.checked }))
                }
              />
              Pauze inplannen?
            </label>
            */}
          </div>

          {/* Focus */}
          <div>
            <h2 className="text-xl font-semibold mb-2">🎯 Focus</h2>

            <label className="block font-medium mb-1">Vakgebied</label>
            <input
              type="text"
              name="vakgebied"
              value={form.vakgebied}
              onChange={handleChange}
              placeholder="vb. Cybersecurity"
              className="w-full border p-2 rounded mb-4"
            />

            <label className="block font-medium mb-1">Focus</label>
            <input
              type="text"
              name="focus"
              value={form.focus}
              onChange={handleChange}
              placeholder="vb. Penetration Testing"
              className="w-full border p-2 rounded mb-4"
            />

            <fieldset className="mb-4">
              <legend className="font-medium mb-1">Opportuniteit</legend>
              <label className="block">
                <input
                  type="checkbox"
                  name="opportuniteit"
                  value="Stage"
                  onChange={handleChange}
                  checked={form.opportuniteit.includes("Stage")}
                />{" "}
                Stage
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  name="opportuniteit"
                  value="Studentenjob"
                  onChange={handleChange}
                  checked={form.opportuniteit.includes("Studentenjob")}
                />{" "}
                Studentenjob
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  name="opportuniteit"
                  value="Bachelorproef"
                  onChange={handleChange}
                  checked={form.opportuniteit.includes("Bachelorproef")}
                />{" "}
                Bachelorproef
              </label>
            </fieldset>

            <fieldset className="mb-4">
              <legend className="font-medium mb-1">Taal</legend>
              <label className="block">
                <input
                  type="checkbox"
                  name="talen"
                  value="Nederlands"
                  onChange={handleChange}
                  checked={form.talen.includes("Nederlands")}
                />{" "}
                Nederlands
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  name="talen"
                  value="Engels"
                  onChange={handleChange}
                  checked={form.talen.includes("Engels")}
                />{" "}
                Engels
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  name="talen"
                  value="Frans"
                  onChange={handleChange}
                  checked={form.talen.includes("Frans")}
                />{" "}
                Frans
              </label>
            </fieldset>
          </div>

          {/* Beschrijving */}
          <div>
            <h2 className="text-xl font-semibold mb-2">📄 Beschrijving</h2>
            <textarea
              name="beschrijving"
              rows="5"
              value={form.beschrijving}
              onChange={handleChange}
              placeholder="Beschrijf wat studenten mogen verwachten van deze speeddate."
              className="w-full border p-2 rounded"
              required
            ></textarea>
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition"
            >
              Speeddate aanmaken
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Aanmaken;
