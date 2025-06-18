import React, { useState, useEffect } from "react";

function Aanmaken() {
  const [form, setForm] = useState({
    starttijd: "", // Formatted as "HH:MM"
    eindtijd: "",   // Formatted as "HH:MM"
    breakStart: "", // Formatted as "HH:MM"
    breakEnd: "",   // Formatted as "HH:MM"
    timePerStudent: "15",
    lokaalId: "",
    vakgebied: "",
    focus: "",
    opportuniteit: [],
    talen: [],
    talenChecked: {
        Nederlands: false,
        Engels: false,
        Frans: false,
    },
    beschrijving: "",
  });

  const [bedrijfId, setBedrijfId] = useState(null);
  const [speeddateSlots, setSpeeddateSlots] = useState([]);
  const [availableLokalen, setAvailableLokalen] = useState([]);
  const [globalSettings, setGlobalSettings] = useState(null); // { dayStartTime: "HH:MM", dayEndTime: "HH:MM" }

  useEffect(() => {
    const storedBedrijfId = localStorage.getItem('bedrijfId');
    if (storedBedrijfId) {
      setBedrijfId(storedBedrijfId);
    } else {
      console.warn("Bedrijf ID niet gevonden in localStorage. Gelieve in te loggen.");
    }

    const fetchLokalen = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/lokalen");
        if (!res.ok) {
          throw new Error("Kon lokalen niet ophalen.");
        }
        const data = await res.json();
        setAvailableLokalen(data.lokalen);
      } catch (err) {
        console.error("Fout bij ophalen lokalen:", err);
        alert("Fout bij het laden van lokalen: " + (err.message || "Onbekende fout"));
      }
    };

    const fetchGlobalSettings = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/speeddate-dag");
            if (!res.ok) {
                const defaultSettings = { dayStartTime: "09:00", dayEndTime: "17:00" };
                const createRes = await fetch("http://localhost:4000/api/speeddate-dag", {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(defaultSettings)
                });
                if (!createRes.ok) throw new Error("Kon default instellingen niet aanmaken.");
                const createdData = await createRes.json();
                setGlobalSettings(createdData.settings);
                console.warn("Globale instellingen niet gevonden, defaults aangemaakt en toegepast.");
            } else {
                const data = await res.json();
                setGlobalSettings(data.settings);
            }
        } catch (err) {
            console.error("Fout bij ophalen/aanmaken globale instellingen:", err);
            setGlobalSettings({
                dayStartTime: "09:00",
                dayEndTime: "17:00"
            });
            alert("Fout bij het laden van globale dagtijden. Standaardwaarden (09:00-17:00) worden gebruikt.");
        }
    };

    fetchLokalen();
    fetchGlobalSettings();
  }, []);

  useEffect(() => {
    if (globalSettings) {
        calculateSpeeddateSlots();
    }
  }, [form.starttijd, form.eindtijd, form.breakStart, form.breakEnd, form.timePerStudent, globalSettings]);


  const parseTime = (timeStr) => {
    if (!timeStr || !timeStr.includes(':')) {
        return new Date(0, 0, 0, 0, 0, 0);
    }
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date) => {
    if (isNaN(date.getTime())) {
        return "00:00";
    }
    return date.toTimeString().slice(0, 5);
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

    if (isNaN(slotDuration) || slotDuration <= 0 || start.getTime() >= end.getTime()) {
      setSpeeddateSlots([]);
      return;
    }

    const slots = [];
    let currentTime = new Date(start);

    let parsedBreakStart = breakStart ? parseTime(breakStart) : null;
    let parsedBreakEnd = breakEnd ? parseTime(breakEnd) : null;

    // Validate and normalize break times: must be within main speeddate period
    if (parsedBreakStart && parsedBreakEnd) {
        if (parsedBreakStart.getTime() >= parsedBreakEnd.getTime() ||
            parsedBreakStart.getTime() < start.getTime() ||
            parsedBreakEnd.getTime() > end.getTime()) {
            console.warn("Ongeldige pauzetijden genegeerd: pauze is buiten de speeddate periode of heeft ongeldige start/eindtijd.");
            parsedBreakStart = null; // Ignore invalid break
            parsedBreakEnd = null;
        }
    }


    while (currentTime.getTime() < end.getTime()) {
        // Controleer of de huidige tijd binnen een pauze valt of een pauze nadert
        if (parsedBreakStart && parsedBreakEnd) {
            // Als we bij de start van de pauze zijn of erin vallen
            if (currentTime.getTime() < parsedBreakEnd.getTime() && currentTime.getTime() >= parsedBreakStart.getTime()) {
                // Voeg de pauze toe als een enkel blok
                slots.push({
                    startTime: formatTime(parsedBreakStart),
                    endTime: formatTime(parsedBreakEnd),
                    type: 'break',
                });
                currentTime = new Date(parsedBreakEnd); // Spring over de pauze heen
                continue; // Ga naar de volgende iteratie
            }
        }

        // Genereer een potentieel slot
        let potentialSlotEnd = new Date(currentTime.getTime() + slotDuration * 60 * 1000);

        // Als een slot de pauze zou overlappen, cap het dan bij de start van de pauze
        if (parsedBreakStart && potentialSlotEnd.getTime() > parsedBreakStart.getTime() && currentTime.getTime() < parsedBreakStart.getTime()) {
            potentialSlotEnd = parsedBreakStart;
        }

        // Zorg ervoor dat het slot niet voorbij de eindtijd van de totale periode gaat
        if (potentialSlotEnd.getTime() > end.getTime()) {
            potentialSlotEnd = end;
        }

        // Voeg het slot alleen toe als het een geldige duur heeft
        if (currentTime.getTime() < potentialSlotEnd.getTime()) {
            slots.push({
                startTime: formatTime(currentTime),
                endTime: formatTime(potentialSlotEnd),
                type: 'slot',
                status: 'open',
                student: null,
            });
            currentTime = potentialSlotEnd; // Verplaats de huidige tijd naar het einde van het zojuist toegevoegde slot
        } else {
            // Voorkom oneindige lussen als currentTime niet vooruitgaat
            if (currentTime.getTime() === potentialSlotEnd.getTime()) {
                currentTime = new Date(currentTime.getTime() + 1 * 60 * 1000); // Advance by a minute
            } else {
                // Should not happen with correct logic, but a safeguard
                break;
            }
        }
    }
    setSpeeddateSlots(slots);
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "talen") {
          setForm((prev) => ({
              ...prev,
              talenChecked: {
                  ...prev.talenChecked,
                  [value]: checked,
              },
              talen: checked
                  ? [...prev.talen, value]
                  : prev.talen.filter((item) => item !== value),
          }));
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], value]
            : prev[name].filter((item) => item !== value),
        }));
      }
    } else {
      const [field, subField] = name.split('_');
      if (subField === 'hour' || subField === 'minute') {
          const currentCombinedTime = form[field] || "00:00";
          const currentHour = currentCombinedTime.split(':')[0];
          const currentMinute = currentCombinedTime.split(':')[1];

          let newHour = subField === 'hour' ? value : currentHour;
          let newMinute = subField === 'minute' ? value : currentMinute;

          setForm(prev => ({
              ...prev,
              [field]: `${newHour}:${newMinute}`
          }));
      } else {
          setForm((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bedrijfId) {
      alert("Kan speeddate niet aanmaken: Bedrijf ID is niet beschikbaar. Log opnieuw in.");
      return;
    }
    if (form.talen.length === 0) {
      alert("Gelieve minstens één taal aan te duiden.");
      return
    }

    if (!form.lokaalId) {
        alert("Gelieve een lokaal te selecteren.");
        return;
    }

    // Validatie van de tijden in handleSubmit
    const overallStart = parseTime(form.starttijd);
    const overallEnd = parseTime(form.eindtijd);
    if (overallStart.getTime() >= overallEnd.getTime()) {
        alert("Eindtijd periode moet na starttijd periode liggen.");
        return;
    }
    
    // Validatie van de pauzetijden
    const parsedBreakStart = form.breakStart ? parseTime(form.breakStart) : null;
    const parsedBreakEnd = form.breakEnd ? parseTime(form.breakEnd) : null;

    if (parsedBreakStart && parsedBreakEnd && parsedBreakStart.getTime() >= parsedBreakEnd.getTime()) {
        alert("Eindtijd pauze moet na starttijd pauze liggen.");
        return;
    }


    if (globalSettings) {
        const globalDayStart = parseTime(globalSettings.dayStartTime);
        const globalDayEnd = parseTime(globalSettings.dayEndTime);

        // Controleer of de totale speeddate periode binnen de globale dagtijden valt
        if (overallStart < globalDayStart || overallEnd > globalDayEnd) {
            alert(`De totale speeddate periode moet liggen tussen ${globalSettings.dayStartTime} en ${globalSettings.dayEndTime}.`);
            return;
        }
        
        // Controleer of pauzetijden binnen globale dagtijden vallen (als ze ingevuld zijn)
        if (parsedBreakStart && parsedBreakEnd) {
            if (parsedBreakStart < globalDayStart || parsedBreakEnd > globalDayEnd) {
                alert(`Pauzetijden moeten binnen de globale speeddate dag (${globalSettings.dayStartTime}-${globalSettings.dayEndTime}) vallen.`);
                return;
            }
        }
    }


    const bookableSpeeddateSlots = speeddateSlots.filter(slot => slot.type === 'slot');

    if (bookableSpeeddateSlots.length === 0) {
      alert("Gelieve geldige tijden en een duur per student in te voeren om speeddate slots te genereren. Er zijn geen boekbare slots gegenereerd.");
      return;
    }

    try {
      const dataToSend = {
        ...form,
        bedrijfId: bedrijfId,
        lokaal: form.lokaalId,
        speeddateSlots: bookableSpeeddateSlots,
      };

      delete dataToSend.breakStart;
      delete dataToSend.breakEnd;
      delete dataToSend.timePerStudent;
      delete dataToSend.lokaalId;
      delete dataToSend.talenChecked;


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
        lokaalId: "",
        vakgebied: "",
        focus: "",
        opportuniteit: [],
        talen: [],
        talenChecked: {
            Nederlands: false,
            Engels: false,
            Frans: false,
        },
        beschrijving: "",
      });
      setSpeeddateSlots([]);
    } catch (err) {
      console.error(err);
      alert(`Er ging iets mis bij het aanmaken: ${err.message || "Onbekende fout"}`);
    }
  };

  // Functie om de select-opties voor uren en minuten te renderen
  const renderTimeSelect = (fieldName, currentValue) => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')); // 00, 05, 10, ..., 55

    const selectedHour = currentValue ? currentValue.split(':')[0] : '00';
    const selectedMinute = currentValue ? currentValue.split(':')[1] : '00';

    const globalDayStart = globalSettings ? parseTime(globalSettings.dayStartTime) : null;
    const globalDayEnd = globalSettings ? parseTime(globalSettings.dayEndTime) : null;

    return (
      <div className="flex gap-1">
        <select
          name={`${fieldName}_hour`}
          value={selectedHour}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          {hours.map(h => {
              const hourTime = parseTime(`${h}:00`);
              let isDisabled = false;
              let className = '';

              if (globalSettings) {
                  isDisabled = (hourTime < globalDayStart || hourTime >= globalDayEnd);
                  className = isDisabled ? 'text-gray-400' : 'text-green-700 font-semibold';
              } else {
                  className = 'text-black';
              }

              return (
                  <option key={h} value={h} className={className} disabled={isDisabled}>
                      {h}
                  </option>
              );
          })}
        </select>
        <span>:</span>
        <select
          name={`${fieldName}_minute`}
          value={selectedMinute}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          {minutes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">
          Speeddate aanmaken
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Tijd & Lokaal */}
          <div>
            <h2 className="text-xl font-semibold mb-2">⏰ Tijd & Lokaal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Starttijd periode</label>
                {renderTimeSelect('starttijd', form.starttijd)}
              </div>
              <div>
                <label className="block font-medium mb-1">Eindtijd periode</label>
                {renderTimeSelect('eindtijd', form.eindtijd)}
              </div>
            </div>

            {/* Pauze toevoegen */}
            <div className="mt-4 border p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Pauze (optioneel)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Pauze starttijd</label>
                  {renderTimeSelect('breakStart', form.breakStart)}
                </div>
                <div>
                  <label className="block font-medium mb-1">Pauze eindtijd</label>
                  {renderTimeSelect('breakEnd', form.breakEnd)}
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
                        className={`py-1 px-2 rounded-md ${
                          slot.type === 'break'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
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

            {/* Lokaal selectieveld */}
            <div className="mt-4">
              <label className="block font-medium mb-1">Selecteer Lokaal</label>
              <select
                name="lokaalId"
                value={form.lokaalId}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Kies een lokaal</option>
                {availableLokalen.map((lokaal) => (
                  <option key={lokaal._id} value={lokaal._id}>
                    {lokaal.name} (Capaciteit: {lokaal.capacity})
                  </option>
                ))}
              </select>
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
                  checked={form.talenChecked.Nederlands}
                />{" "}
                Nederlands
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  name="talen"
                  value="Engels"
                  onChange={handleChange}
                  checked={form.talenChecked.Engels}
                />{" "}
                Engels
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  name="talen"
                  value="Frans"
                  onChange={handleChange}
                  checked={form.talenChecked.Frans}
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