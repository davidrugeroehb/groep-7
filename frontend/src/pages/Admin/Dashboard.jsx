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
  const [alertsCount, setAlertsCount] = useState(0); // Deze state zal nu de bedrijfsaanvragen tellen

  const API_BASE_URL = 'http://localhost:4000/api';

  // Hulpfunctie om API-requests te doen met authenticatie
  const fetchData = async (url) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Netwerk- of serverfout zonder JSON response.' }));
        console.error(`API Fout (${url}):`, response.status, errorData);
        if (response.status === 401 || response.status === 403) {
          alert("Je sessie is verlopen of niet toegestaan. Gelieve opnieuw in te loggen.");
          // window.location.href = '/login';
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.count; // Uw API's retourneren een object { count: X }
    } catch (error) {
      console.error(`Fout bij het ophalen van gegevens van ${url}:`, error);
      return 0; // Retourneer 0 in geval van fout
    }
  };

  useEffect(() => {
    const getCounts = async () => {
      const sdCount = await fetchData(`${API_BASE_URL}/speeddates/count`);
      setSpeeddatesCount(sdCount);

      const stCount = await fetchData(`${API_BASE_URL}/students/count`);
      setStudentsCount(stCount);

      const bdCount = await fetchData(`${API_BASE_URL}/bedrijven/count`); // Telt nu goedgekeurde bedrijven
      setBedrijvenCount(bdCount);

      // **** AANPASSING HIER: Nieuwe route voor het tellen van PENDING BEDRIJFSREGISTRATIES ****
      const alCount = await fetchData(`${API_BASE_URL}/bedrijven/pending-registrations/count`);
      setAlertsCount(alCount);
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
            <BsLightningChargeFill className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">{speeddatesCount}</h1>
        </div>

        <div className="flex flex-col justify-around p-4 rounded-md bg-red-400 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">STUDENTEN</h3>
            <BsPeopleFill className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">{studentsCount}</h1>
        </div>

        <div className="flex flex-col justify-around p-4 rounded-md bg-purple-700 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">BEDRIJVEN</h3>
            <BsMenuButtonWideFill className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">{bedrijvenCount}</h1>
        </div>

        <div className="flex flex-col justify-around p-4 rounded-md bg-green-600 text-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">ALERTS</h3>
            <BsCheckCircleFill className="text-2xl" />
          </div>
          <h1 className="text-3xl font-bold">{alertsCount}</h1>
        </div>
      </div>

      <div className="charts">
        {/* Hier plaatsen we eventuele charts-componenten, geen prioriteit */}
      </div>
    </main>
  );
}

export default Dashboard;