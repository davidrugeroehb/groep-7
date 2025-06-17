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
      const data = await response.json();
      if (data && typeof data.count === 'number') {
        return data.count;
      } else {
        console.error(`Verwachte 'count' eigenschap niet gevonden of is geen nummer voor URL: ${url}`, data);
        return 0;
      }
    } catch (error) {
      console.error(`Fout bij het ophalen van gegevens van ${url}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const getCounts = async () => {
      try {
        const sdCount = await authenticatedFetch(`${API_BASE_URL}/speeddates/count`);
        setSpeeddatesCount(sdCount);

        const stCount = await authenticatedFetch(`${API_BASE_URL}/students/count`);
        setStudentsCount(stCount);

        const bdCount = await authenticatedFetch(`${API_BASE_URL}/bedrijven/count`);
        setBedrijvenCount(bdCount);

        const alCount = await authenticatedFetch(`${API_BASE_URL}/bedrijven/pending-registrations/count`);
        setAlertsCount(alCount);
      } catch (err) {
        console.error("Fout bij het laden van dashboard tellers:", err);
      }
    };

    getCounts();
  }, []);

  return (
    <main className="col-span-3 row-span-2 overflow-y-auto p-5 text-black">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">DASHBOARD</h3>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-6">
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
            <h3 className="text-lg font-semibold">ALERTS</h3>
            <h1>{alertsCount}</h1>
          </div>
          <BsCheckCircleFill className="text-2xl" />
        </div>
      </div>

      <div className="charts">
        {/* hier plaatsen we eventuele charts-componenten, geen prioriteit */}
      </div>

      {/* NIEUWE SECTIE: Knop om Admin formulier te openen */}
      {localStorage.getItem('role') === 'admin' && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAdminFormModal(true)}
            // AANPASSING HIER: Kleur van de knop
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
          >
            Nieuwe Administrator Aanmaken
          </button>
        </div>
      )}

      {/* NIEUWE COMPONENT: De modale overlay voor het admin formulier */}
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" // AANPASSING HIER: Kleur van submit knop in formulier
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