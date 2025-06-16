import React, { useState, useEffect } from "react";

function Aanmaken() {
  const [form, setForm] = useState({
    starttijd: "",
    eindtijd: "",
    breakStart: "", // NEW: Break start time
    breakEnd: "",   // NEW: Break end time
    timePerStudent: "15", // NEW: Default time per student
    lokaal: "",
    vakgebied: "",
    focus: "",
    opportuniteit: [],
    talen: [],
    beschrijving: "",
    naamVertegenwoordiger: "",
  });

  const [bedrijfId, setBedrijfId] = useState(null);
  const [speeddateSlots, setSpeeddateSlots] = useState([]); // To display calculated slots

  useEffect(() => {
    const storedBedrijfId = localStorage.getItem('bedrijfId');
    if (storedBedrijfId) {
      setBedrijfId(storedBedrijfId);
    } else {
      console.warn("Bedrijf ID niet gevonden in localStorage. Gelieve in te loggen.");
    }
  }, []);

  useEffect(() => {
    // Recalculate speeddate slots whenever main time inputs or break/slot duration change
    calculateSpeeddateSlots();
  }, [form.starttijd, form.eindtijd, form.breakStart, form.breakEnd, form.timePerStudent]);

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date) => {
    return date.toTimeString().slice(0, 5); // Returns HH:MM
  };

  const calculateSpeeddateSlots = () => {
    const { starttijd, eindtijd, breakStart, breakEnd, timePerStudent } = form;

    if (!starttijd || !eindtijd || !timePerStudent) {
      setSpeeddateSlots([]);
      return;
    }

    const start = parseTime(starttijd);
    const end = parseTime(eindtijd);
    const slotDuration = parseInt(timePerStudent, 10);

    if (isNaN(slotDuration) || slotDuration <= 0) {
      setSpeeddateSlots([]);
      return;
    }

    const slots = [];
    let currentTime = new Date(start);

    const parsedBreakStart = breakStart ? parseTime(breakStart) : null;
    const parsedBreakEnd = breakEnd ? parseTime(breakEnd) : null;

    while (currentTime < end) {
      let slotEndTime = new Date(currentTime.getTime() + slotDuration * 60 * 1000);

      // Check if current slot needs to include a break or is entirely a break
      if (parsedBreakStart && parsedBreakEnd) {
        // Case 1: Current slot starts before break and ends within break
        if (currentTime < parsedBreakStart && slotEndTime > parsedBreakStart && slotEndTime <= parsedBreakEnd) {
          // Add the part before the break as a regular slot
          if (currentTime < parsedBreakStart) {
            slots.push({
              startTime: formatTime(currentTime),
              endTime: formatTime(parsedBreakStart),
              type: 'slot',
            });
          }
          // Then add the break itself
          slots.push({
            startTime: formatTime(parsedBreakStart),
            endTime: formatTime(parsedBreakEnd),
            type: 'break',
          });
          currentTime = new Date(parsedBreakEnd); // Jump past the break
          continue;
        }
        // Case 2: Current slot starts within break
        if (currentTime >= parsedBreakStart && currentTime < parsedBreakEnd) {
          // Add the break itself, extending to its end if the slot duration would exceed it
          const actualBreakEnd = slotEndTime > parsedBreakEnd ? parsedBreakEnd : slotEndTime;
          slots.push({
            startTime: formatTime(currentTime),
            endTime: formatTime(actualBreakEnd),
            type: 'break',
          });
          currentTime = new Date(actualBreakEnd); // Move past this portion of the break
          if (currentTime < parsedBreakEnd) { // If still within the defined break, jump to its end
            currentTime = new Date(parsedBreakEnd);
          }
          continue;
        }
        // Case 3: Current slot spans across the entire break (starts before, ends after)
        if (currentTime < parsedBreakStart && slotEndTime > parsedBreakEnd) {
          // Add part before break
          slots.push({
            startTime: formatTime(currentTime),
            endTime: formatTime(parsedBreakStart),
            type: 'slot',
          });
          // Add the break itself
          slots.push({
            startTime: formatTime(parsedBreakStart),
            endTime: formatTime(parsedBreakEnd),
            type: 'break',
          });
          currentTime = new Date(parsedBreakEnd); // Jump past the break for the next slot
          continue; // Re-evaluate the new currentTime
        }
      }

      // Ensure slot does not extend beyond overall end time
      if (slotEndTime > end) {
        slotEndTime = end;
      }

      // Only add regular slot if it has a positive duration and isn't a partial break
      if (currentTime < slotEndTime) {
        slots.push({
          startTime: formatTime(currentTime),
          endTime: formatTime(slotEndTime),
          type: 'slot', // Default type for regular slots
          status: 'open', // Default status for sub-speeddates
          student: null, // Initially no student assigned
        });
      }
      currentTime = new Date(slotEndTime); // Move to the end of the current slot for the next iteration
    }
    setSpeeddateSlots(slots);
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bedrijfId) {
      alert("Kan speeddate niet aanmaken: Bedrijf ID is niet beschikbaar. Log opnieuw in.");
      return;
    }

    // Filter out break slots before sending to backend, as backend only cares about bookable slots
    const bookableSpeeddateSlots = speeddateSlots.filter(slot => slot.type === 'slot');

    if (bookableSpeeddateSlots.length === 0) {
      alert("Gelieve geldige tijden en een duur per student in te voeren om speeddate slots te genereren. Er zijn geen boekbare slots gegenereerd.");
      return;
    }

    try {
      const dataToSend = {
        ...form,
        bedrijfId: bedrijfId,
        speeddateSlots: bookableSpeeddateSlots, // Send only bookable slots
      };

      // Remove breakStart, breakEnd, timePerStudent from the main form data before sending
      // as they are used to generate slots, not stored as separate fields on the main speeddate.
      delete dataToSend.breakStart;
      delete dataToSend.breakEnd;
      delete dataToSend.timePerStudent;

      const res = await fetch("http://localhost:4000/api/speeddates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Aanmaken mislukt");
      }

      alert("Speeddate aangemaakt!");
      setForm({
        starttijd: "",
        eindtijd: "",
        breakStart: "",
        breakEnd: "",
        timePerStudent: "15",
        lokaal: "",
        vakgebied: "",
        focus: "",
        opportuniteit: [],
        talen: [],
        beschrijving: "",
        naamVertegenwoordiger: "",
      });
      setSpeeddateSlots([]); // Clear displayed slots after submission
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
          {/* Tijd & Lokaal */}
          <div>
            <h2 className="text-xl font-semibold mb-2">⏰ Tijd & Lokaal</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Starttijd periode</label>
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
                <label className="block font-medium mb-1">Eindtijd periode</label>
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

            {/* Pauze toevoegen */}
            <div className="mt-4 border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Pauze (optioneel)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Pauze starttijd</label>
                  <input
                    type="time"
                    name="breakStart"
                    value={form.breakStart}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Pauze eindtijd</label>
                  <input
                    type="time"
                    name="breakEnd"
                    value={form.breakEnd}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Tijd per student */}
            <div className="mt-4">
              <label className="block font-medium mb-1">Tijd per student (minuten)</label>
              <select
                name="timePerStudent"
                value={form.timePerStudent}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="10">10 min</option>
                <option value="15">15 min</option>
                <option value="20">20 min</option>
                <option value="25">25 min</option>
                <option value="30">30 min</option>
              </select>
            </div>

            {/* Visuele Timeline */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">🗓️ Beschikbare Speeddate Slots</h2>
              {speeddateSlots.length > 0 ? (
                <div className="border p-4 rounded-md bg-white shadow-sm max-h-60 overflow-y-auto">
                  <p className="mb-2 text-gray-600">Deze slots worden gegenereerd op basis van je input:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {speeddateSlots.map((slot, index) => (
                      <li
                        key={index}
                        className={`py-1 px-2 rounded-md ${slot.type === 'break'
                            ? 'bg-red-100 text-red-800' // Distinct color for break slots
                            : 'bg-green-100 text-green-800' // Default color for regular slots
                          }`}
                      >
                        {slot.startTime} - {slot.endTime} {slot.type === 'break' && "(Pauze)"}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">Vul de start-/eindtijd en tijd per student in om de slots te zien.</p>
              )}
            </div>

            {/* Lokaal invoerveld */}
            <div className="mt-4">
              <label className="block font-medium mb-1">Lokaal</label>
              <input
                type="text"
                name="lokaal"
                value={form.lokaal}
                onChange={handleChange}
                placeholder="bv. Lokaal A1.01"
                required
                className="w-full border p-2 rounded"
              />
            </div>

              {/*Vertegenwoordiger invoerveld */}
            <div className="mt-4">
              <label className="block font-medium mb-1">Naam vertegenwoordiger</label>
              <input
                type="text"
                name="naamVertegenwoordiger"
                value={form.naamVertegenwoordiger}
                onChange={handleChange}
                placeholder="bv. Jan Jansen"
                required
                className="w-full border p-2 rounded"
              />
            </div>

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