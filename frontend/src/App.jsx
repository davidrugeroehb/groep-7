import React from 'react';
import './index.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import BedrijfNavbar from './components/BedrijfNavbar';
import ProtectRoute from './components/ProtectRoute'; // Zorg dat deze import correct is

// Algemeen
import About from './pages/About';
import Login from './pages/Login';

// Bedrijf
import BedrijfSignup from './pages/Bedrijf/BedrijfSignup';
import Home from './pages/Bedrijf/Home';
import Aanmaken from './pages/Bedrijf/Aanmaken';
import Aanvragen from './pages/Bedrijf/Aanvragen';
import BedrijfProfiel from './pages/Bedrijf/BedrijfProfiel';
import StudentenZoeken from './pages/Bedrijf/StudentenZoeken';
import MailIntre from './pages/Bedrijf/Mail_intre'

// Student
import Speeddates from './pages/Student/Speeddates';
import MijnAanvragen from './pages/Student/MijnAanvragen';
import MijnAfspraken from './pages/Student/MijnAfspraken';
import MijnProfiel from './pages/Student/MijnProfiel';

//Admin
import Dashboard from './pages/Admin/Dashboard';
import AdSpeeddates from './pages/Admin/AdSpeeddate';
import Instellingen from './pages/Admin/AdInstellingen';
import AdminLayout from './pages/Admin/AdminLayOut';
import Bedrijvenbeheer from './pages/Admin/Bedrijvenbeheer';
import StudentenBeheer from './pages/Admin/StudentenBeheer'; // Importeer als StudentenBeheer


function App() {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const hideNavbar = ["/login", "/bedrijf/signup"].includes(location.pathname) || location.pathname.startsWith("/admin");

  let currentNavbar = <Navbar />;
  if (role === "bedrijf") {
    currentNavbar = <BedrijfNavbar />;
  }
  // Als je een aparte AdminNavbar wilt, voeg hier toe:
  // else if (role === "admin") {
  //   currentNavbar = <AdminNavbar />; // Zorg dat AdminNavbar is geÃ¯mporteerd en bestaat
  // }

  return (
    <>
      {!hideNavbar && currentNavbar}

      <Routes>
        <Route path="/" element={<Navigate to="/speeddates" />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />


        {/* Bedrijf Routes */}
        <Route path="/bedrijf/signup" element={<BedrijfSignup />} />
        <Route path="/bedrijf-home" element={<Home />} />
        <Route path="/aanmaken" element={<Aanmaken />} />
        <Route path="/bedrijf-aanvragen" element={<Aanvragen />} />
        <Route path="/bedrijf-profiel" element={<BedrijfProfiel />} />
        <Route path="/studenten-zoeken" element={<StudentenZoeken />} />
        <Route path="/bedrijf-mail" element={<MailIntre />} />

        {/* Student Routes */}
        <Route path="/speeddates" element={<Speeddates />} />
        <Route path="/mijnaanvragen" element={<MijnAanvragen />} />
        <Route path="/mijnafspraken" element={<MijnAfspraken />} />
        <Route path="/mijnprofiel" element={<MijnProfiel />} />


        {/* Admin Routes - Geneste routes binnen een ProtectRoute */}
        <Route path="/admin" element={<ProtectRoute allowedRoles={["admin"]} />}>
          <Route path="dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="bedrijvenbeheer" element={<AdminLayout><Bedrijvenbeheer /></AdminLayout>} />
          <Route path="studentenbeheer" element={<AdminLayout><StudentenBeheer /></AdminLayout>} />
          <Route path="speeddatesbeheer" element={<AdminLayout><AdSpeeddates /></AdminLayout>} />
          <Route path="instellingen" element={<AdminLayout><Instellingen /></AdminLayout>} />
          {/* Standaard redirect voor /admin als het direct wordt bezocht */}
          <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Catch-all route voor het geval /admin-home of /admindashboard nog ergens worden gebruikt en je ze wilt redirecten */}
        {/* Optioneel: als je zeker weet dat alle navigatie /admin/dashboard gebruikt, kun je deze weglaten */}
        <Route path="/admin-home" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admindashboard" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;