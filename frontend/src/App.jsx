import React from 'react';
import './index.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import BedrijfNavbar from './components/BedrijfNavbar';



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

// Student
import Speeddates from './pages/Student/Speeddates';
import MijnAanvragen from './pages/Student/MijnAanvragen';
import MijnAfspraken from './pages/Student/MijnAfspraken';
import MijnProfiel from './pages/Student/MijnProfiel';

//Admin

import Dashboard from './pages/Admin/Dashboard';
import AdSpeeddates from './pages/Admin/AdSpeeddate';
import Studenten from './pages/Admin/AdStudenten';
import Bedrijven from './pages/Admin/AdBedrijven';
import Instellingen from './pages/Admin/AdInstellingen';
import AdminLayout from './pages/Admin/AdminLayOut';

function App() {
  const location = useLocation();
  const role = localStorage.getItem("role"); // "student" of "bedrijf"

  // Toon juiste navbar op basis van rol
  const hideNavbar = ["/login", "/bedrijf/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && (role === "bedrijf" ? <BedrijfNavbar /> : <Navbar />)}

      <Routes>
        {/* Redirect */}
        <Route path="/" element={<Navigate to="/speeddates" />} />

        {/* Algemeen */}
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />

        {/* Bedrijf */}
        <Route path="/bedrijf/signup" element={<BedrijfSignup />} />
        <Route path="/bedrijf-home" element={<Home />} />
        <Route path="/aanmaken" element={<Aanmaken />} />
        <Route path="/bedrijf-aanvragen" element={<Aanvragen />} />
        <Route path="/bedrijf-profiel" element={<BedrijfProfiel />} />
        <Route path="/studenten-zoeken" element={<StudentenZoeken />} />

        {/* Student */}
        <Route path="/speeddates" element={<Speeddates />} />
        <Route path="/mijnaanvragen" element={<MijnAanvragen />} />
        <Route path="/mijnafspraken" element={<MijnAfspraken />} />
        <Route path="/mijnprofiel" element={<MijnProfiel />} />

        {/* Admin */}
        <Route path="/admindashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/adspeeddate" element={<AdminLayout><AdSpeeddates /></AdminLayout>} />
        <Route path="/adstudenten" element={<AdminLayout><Studenten /></AdminLayout>} />
        <Route path="/adbedrijven" element={<AdminLayout><Bedrijven /></AdminLayout>} />
        <Route path="/adinstellingen" element={<AdminLayout><Instellingen /></AdminLayout>} />

      </Routes>
    </>
  );
}

export default App;
