import React from 'react';
import './index.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import BedrijfNavbar from './components/BedrijfNavbar';
import ProtectRoute from './components/ProtectRoute';


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
import Studentenbeheer from './pages/Admin/Studentenbeheer';


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
        <Route path="/bedrijf-mail" element={<MailIntre />} />
        {/* Student */}
        <Route path="/speeddates" element={<Speeddates />} />
        <Route path="/mijnaanvragen" element={<MijnAanvragen />} />
        <Route path="/mijnafspraken" element={<MijnAfspraken />} />
        <Route path="/mijnprofiel" element={<MijnProfiel />} />

        {/* Admin */}
        <Route path="/admindashboard" element={
            <ProtectRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectRoute>
          } />

        <Route path="/adspeeddate" element={
            <ProtectRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdSpeeddates />
              </AdminLayout>
            </ProtectRoute>
          } />


        <Route path="/adinstellingen" element={
            <ProtectRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Instellingen />
              </AdminLayout>
            </ProtectRoute>
          } />

        
        <Route path="/adminbedrijfbeheer" element={
            <ProtectRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Bedrijvenbeheer />
                </AdminLayout>
            </ProtectRoute>
          }/>
        <Route path="/adminstudentbeheer" element={
            <ProtectRoute allowedRoles={["admin"]}>
            <AdminLayout>
                <Studentenbeheer />
            </AdminLayout>
            </ProtectRoute>
          }/>
      </Routes>
    </>
  );
}

export default App;