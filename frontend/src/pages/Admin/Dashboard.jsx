import React, { useState, useEffect } from 'react';
import {
  BsLightningChargeFill,
  BsPeopleFill,
  BsMenuButtonWideFill,
  BsCheckCircleFill
} from 'react-icons/bs';

function Dashboard() {
  const [speeddatesCount, setSpeeddatesCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [bedrijvenCount, setBedrijvenCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);
  const [showAdminFormModal, setShowAdminFormModal] = useState(false);

  // NIEUW: States voor Globale Speeddate Instellingen
  const [globalSettings, setGlobalSettings] = useState({ dayStartTime: '', dayEndTime: '' });
  const [settingsMessage, setSettingsMessage] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // NIEUW: States voor Lokaal Beheer
  const [lokalen, setLokalen] = useState([]);
  const [newLokaal, setNewLokaal] = useState({ name: '', capacity: '' });
  const [editingLokaal, setEditingLokaal] = useState(null); // Voor lokaal dat wordt bewerkt
  const [lokaalMessage, setLokaalMessage] = useState('');
  const [lokaalError, setLokaalError] = useState('');

  const API_BASE_URL = 'http://localhost:4000/api';

  // Hulpfunctie om API-requests te doen met authenticatie
  const authenticatedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        let errorData = { message: 'Onbekende fout' };
        try {
          errorData = await response.json();
        } catch (jsonErr) {
          console.warn(`Geen JSON response bij fout ${response.status} van ${url}`);
          errorData.message = `Netwerk- of serverfout: Status ${response.status}.`;
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Fout bij het ophalen van gegevens van ${url}:`, error);
      throw error;
    }
  };

  // Helper function to parse time string "HH:MM" to Date object
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Helper function to render time select dropdowns (copied from Aanmaken.jsx)
  const renderTimeSelect = (fieldName, currentValue) => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')); // 00, 05, 10, ..., 55

    const selectedHour = currentValue ? currentValue.split(':')[0] : '00';
    const selectedMinute = currentValue ? currentValue.split(':')[1] : '00';

    return (
      <div className="flex gap-1">
        <select
          name={`${fieldName}_hour`}
          value={selectedHour}
          onChange={handleSettingsChange}
          required
          className="w-full border p-2 rounded"
        >
          {hours.map(h => (
              <option key={h} value={h} className="text-black">
                  {h}
              </option>
          ))}
        </select>
        <span>:</span>
        <select
          name={`${fieldName}_minute`}
          value={selectedMinute}
          onChange={handleSettingsChange}
          required
          className="w-full border p-2 rounded"
        >
          {minutes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    );
  };


  // Effect voor het ophalen van tellers (bestaand)
  useEffect(() => {
    const getCounts = async () => {
      try {
        const sdCountData = await authenticatedFetch(`${API_BASE_URL}/speeddates/count`);
        setSpeeddatesCount(sdCountData.count);

        const stCountData = await authenticatedFetch(`${API_BASE_URL}/students/count`);
        setStudentsCount(stCountData.count);

        const bdCountData = await authenticatedFetch(`${API_BASE_URL}/bedrijven/count`);
        setBedrijvenCount(bdCountData.count);

        const alCountData = await authenticatedFetch(`${API_BASE_URL}/aanvragen/pending/count`);
        setAlertsCount(alCountData.count);
      } catch (err) {
        console.error("Fout bij het laden van dashboard tellers:", err);
      }
    };

    getCounts();
  }, []);

  // NIEUW EFFECT: Ophalen van Globale Speeddate Instellingen
  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const data = await authenticatedFetch(`${API_BASE_URL}/speeddate-dag`);
        setGlobalSettings(data.settings);
      } catch (err) {
        console.error("Fout bij het laden van globale instellingen:", err);
        setGlobalSettings({ dayStartTime: "09:00", dayEndTime: "17:00" });
        setSettingsError("Kon globale instellingen niet laden. Defaults toegepast.");
      }
    };
    fetchGlobalSettings();
  }, []);

  // NIEUW EFFECT: Ophalen van Lokalen
  useEffect(() => {
    const fetchLokalen = async () => {
      try {
        const data = await authenticatedFetch(`${API_BASE_URL}/lokalen`);
        setLokalen(data.lokalen);
      } catch (err) {
        console.error("Fout bij het laden van lokalen:", err);
        setLokaalError("Kon lokalen niet laden.");
      }
    };
    fetchLokalen();
  }, []);


  // HANDLERS VOOR GLOBALE INSTELLINGEN
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    // Special handling for hour/minute selects
    const [field, subField] = name.split('_'); // e.g., "dayStartTime_hour", "dayStartTime_minute"

    if (subField === 'hour' || subField === 'minute') {
        // Initialiseer met de huidige waarde uit globalSettings, of een default "00:00" als leeg
        const currentCombinedTime = globalSettings[field] || "00:00";
        const parts = currentCombinedTime.split(':');
        const currentHour = parts[0];
        const currentMinute = parts[1];

        let newHour = subField === 'hour' ? value : currentHour;
        let newMinute = subField === 'minute' ? value : currentMinute;

        setGlobalSettings(prev => ({
            ...prev,
            [field]: `${newHour}:${newMinute}`
        }));
    } else {
        setGlobalSettings({ ...globalSettings, [name]: value });
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSettingsMessage('');
    setSettingsError('');
    try {
      const data = await authenticatedFetch(`${API_BASE_URL}/speeddate-dag`, {
        method: "PUT",
        body: JSON.stringify(globalSettings),
      });
      setGlobalSettings(data.settings);
      setSettingsMessage(data.message);
    } catch (err) {
      setSettingsError(err.message || "Fout bij het bijwerken van instellingen.");
    }
  };

  // HANDLERS VOOR LOKAAL BEHEER
  const handleNewLokaalChange = (e) => {
    setNewLokaal({ ...newLokaal, [e.target.name]: e.target.value });
  };

  const handleAddLokaal = async (e) => {
    e.preventDefault();
    setLokaalMessage('');
    setLokaalError('');
    try {
      const data = await authenticatedFetch(`${API_BASE_URL}/lokalen`, {
        method: "POST",
        body: JSON.stringify({ name: newLokaal.name, capacity: parseInt(newLokaal.capacity, 10) }),
      });
      setLokalen([...lokalen, data.lokaal]);
      setNewLokaal({ name: '', capacity: '' });
      setLokaalMessage(data.message);
    } catch (err) {
      setLokaalError(err.message || "Fout bij het toevoegen van lokaal.");
    }
  };

  const handleEditLokaal = (lokaal) => {
    setEditingLokaal({ ...lokaal }); // Kopieer lokaal om te bewerken
  };

  const handleSaveLokaal = async (e) => {
    e.preventDefault();
    setLokaalMessage('');
    setLokaalError('');
    try {
      const data = await authenticatedFetch(`${API_BASE_URL}/lokalen/${editingLokaal._id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editingLokaal.name, capacity: parseInt(editingLokaal.capacity, 10) }),
      });
      setLokalen(lokalen.map(l => l._id === data.lokaal._id ? data.lokaal : l));
      setEditingLokaal(null); // Sluit bewerk-modus
      setLokaalMessage(data.message);
    } catch (err) {
      setLokaalError(err.message || "Fout bij het opslaan van lokaal.");
    }
  };

  const handleDeleteLokaal = async (id) => {
    if (!window.confirm("Weet u zeker dat u dit lokaal wilt verwijderen?")) {
      return;
    }
    setLokaalMessage('');
    setLokaalError('');
    try {
      const data = await authenticatedFetch(`${API_BASE_URL}/lokalen/${id}`, {
        method: "DELETE",
      });
      setLokalen(lokalen.filter(l => l._id !== id));
      setLokaalMessage(data.message);
    } catch (err) {
      setLokaalError(err.message || "Fout bij het verwijderen van lokaal.");
    }
  };


  return (
    <main className="col-span-3 row-span-2 overflow-y-auto p-5 text-black">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">DASHBOARD</h3>
      </div>

      {/* Overzichtskaartjes (bestaand) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="flex flex-col justify-around p-4 rounded-md bg-red-600 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">SPEEDDATES</h3>
            <h1>{speeddatesCount}</h1>
          </div>
          <BsLightningChargeFill className="text-2xl" />
        </div>

        <div className="flex flex-col justify-around p-4 rounded-md bg-red-400 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">STUDENTEN</h3>
            <h1>{studentsCount}</h1>
          </div>
          <BsPeopleFill className="text-2xl" />
        </div>

        <div className="flex flex-col justify-around p-4 rounded-md bg-purple-700 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">BEDRIJVEN</h3>
            <h1>{bedrijvenCount}</h1>
          </div>
          <BsMenuButtonWideFill className="text-2xl" />
        </div>

        <div className="flex flex-col justify-around p-4 rounded-md bg-green-600 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">AANVRAGEN</h3>
            <h1>{alertsCount}</h1>
          </div>
          <BsCheckCircleFill className="text-2xl" />
        </div>
      </div>

      <div className="charts">
        {/* hier plaatsen we eventuele charts-componenten, geen prioriteit */}
      </div>

      {/* NIEUWE SECTIE: Globale Speeddate Instellingen */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Globale Speeddate Dag Instellingen</h2>
        <form onSubmit={handleUpdateSettings} className="space-y-4">
          <div>
            <label htmlFor="dayStartTime" className="block text-sm font-medium text-gray-700">Begin Tijd van de Dag:</label>
            {renderTimeSelect('dayStartTime', globalSettings.dayStartTime)}
          </div>
          <div>
            <label htmlFor="dayEndTime" className="block text-sm font-medium text-gray-700">Eind Tijd van de Dag:</label>
            {renderTimeSelect('dayEndTime', globalSettings.dayEndTime)}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 shadow-sm"
          >
            Instellingen Opslaan
          </button>
          {settingsMessage && <p className="text-green-600 mt-2">{settingsMessage}</p>}
          {settingsError && <p className="text-red-600 mt-2">{settingsError}</p>}
        </form>
      </div>

      {/* NIEUWE SECTIE: Lokaal Beheer */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Lokaal Beheer</h2>

        {/* Formulier om nieuw lokaal toe te voegen */}
        <form onSubmit={handleAddLokaal} className="space-y-4 mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-medium text-gray-700">Nieuw Lokaal Toevoegen</h3>
          <div>
            <label htmlFor="lokaalName" className="block text-sm font-medium text-gray-700">Naam Lokaal:</label>
            <input
              type="text"
              id="lokaalName"
              name="name"
              value={newLokaal.name}
              onChange={handleNewLokaalChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="lokaalCapacity" className="block text-sm font-medium text-gray-700">Capaciteit (aantal gelijktijdige speeddates):</label>
            <input
              type="number"
              id="lokaalCapacity"
              name="capacity"
              value={newLokaal.capacity}
              onChange={handleNewLokaalChange}
              required
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 shadow-sm"
          >
            Lokaal Toevoegen
          </button>
          {lokaalMessage && <p className="text-green-600 mt-2">{lokaalMessage}</p>}
          {lokaalError && <p className="text-red-600 mt-2">{lokaalError}</p>}
        </form>

        {/* Lijst van Lokalen */}
        <h3 className="text-lg font-medium text-gray-700 mb-3">Bestaande Lokalen</h3>
        {lokalen.length === 0 ? (
          <p className="text-gray-500">Geen lokalen gevonden. Voeg hierboven een lokaal toe.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capaciteit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lokalen.map((lokaal) => (
                  <tr key={lokaal._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingLokaal && editingLokaal._id === lokaal._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editingLokaal.name}
                          onChange={(e) => setEditingLokaal({ ...editingLokaal, name: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        lokaal.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingLokaal && editingLokaal._id === lokaal._id ? (
                        <input
                          type="number"
                          name="capacity"
                          value={editingLokaal.capacity}
                          onChange={(e) => setEditingLokaal({ ...editingLokaal, capacity: parseInt(e.target.value, 10) })}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        lokaal.capacity
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingLokaal && editingLokaal._id === lokaal._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveLokaal}
                            className="text-green-600 hover:text-green-900"
                          >
                            Opslaan
                          </button>
                          <button
                            onClick={() => setEditingLokaal(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Annuleren
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditLokaal(lokaal)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Bewerk
                          </button>
                          <button
                            onClick={() => handleDeleteLokaal(lokaal._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Verwijder
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* NIEUWE SECTIE: Knop om Admin formulier te openen (bestaand) */}
      {localStorage.getItem('role') === 'admin' && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAdminFormModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
          >
            Nieuwe Administrator Aanmaken
          </button>
        </div>
      )}

      {/* NIEUWE COMPONENT: De modale overlay voor het admin formulier (bestaand) */}
      {showAdminFormModal && (
        <AdminFormModal onClose={() => setShowAdminFormModal(false)}>
          <h2 className="text-2xl font-semibold mb-6 text-black">Nieuwe Administrator Aanmaken</h2>
          <AdminRegistratieForm authenticatedFetch={authenticatedFetch} />
        </AdminFormModal>
      )}
    </main>
  );
}

// AdminRegistratieForm component (bestaand, nu binnen Dashboard.jsx)
const AdminRegistratieForm = ({ authenticatedFetch }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setFormError('');

    try {
      const data = await authenticatedFetch("http://localhost:4000/api/admin/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setMessage(data.message || "Administrator succesvol aangemaakt.");
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      setFormError(err.message || "Fout bij het aanmaken van de administrator.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="adminName" className="block text-gray-700 font-medium">Naam:</label>
        <input
          type="text"
          id="adminName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="adminEmail" className="block text-gray-700 font-medium">E-mailadres:</label>
        <input
          type="email"
          id="adminEmail"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="adminPassword" className="block text-gray-700 font-medium">Wachtwoord:</label>
        <input
          type="password"
          id="adminPassword"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Administrator aanmaken
      </button>
      {message && <p className="text-green-600 mt-2">{message}</p>}
      {formError && <p className="text-red-600 mt-2">{formError}</p>}
    </form>
  );
};


// Modale overlay component
const AdminFormModal = ({ children, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-inhoud">
        <button onClick={onClose} className="sluit-btn absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};


export default Dashboard;