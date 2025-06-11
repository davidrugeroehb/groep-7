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
import Aanmaak from './pages/Admin/StudentenBeheer';


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

      {/* Bedrijf*/}
      <Route path="/bedrijf/signup" element={<BedrijfSignup />} />
      <Route path="/bedrijf-home" element={
        <ProtectRoute allowedRoles={["bedrijf"]}>
          <Home />
        </ProtectRoute>
      } />
      <Route path="/aanmaken" element={
        <ProtectRoute allowedRoles={["bedrijf"]}>
          <Aanmaken />
        </ProtectRoute>
      } />
      <Route path="/bedrijf-aanvragen" element={
        <ProtectRoute allowedRoles={["bedrijf"]}>
          <Aanvragen />
        </ProtectRoute>
      } />
      <Route path="/bedrijf-profiel" element={
        <ProtectRoute allowedRoles={["bedrijf"]}>
          <BedrijfProfiel />
        </ProtectRoute>
      } />
      <Route path="/studenten-zoeken" element={
        <ProtectRoute allowedRoles={["bedrijf"]}>
          <StudentenZoeken />
        </ProtectRoute>
      } />
        <Route path="/bedrijf-mail" element={
         <ProtectRoute allowedRoles={["bedrijf"]}>
            <MailIntre />
          </ProtectRoute>
      } />


      {/* Student*/}
      <Route path="/speeddates" element={
        <ProtectRoute allowedRoles={["student"]}>
          <Speeddates />
        </ProtectRoute>
      } />
      <Route path="/mijnaanvragen" element={
        <ProtectRoute allowedRoles={["student"]}>
          <MijnAanvragen />
        </ProtectRoute>
      } />
      <Route path="/mijnafspraken" element={
        <ProtectRoute allowedRoles={["student"]}>
          <MijnAfspraken />
        </ProtectRoute>
      } />
      <Route path="/mijnprofiel" element={
        <ProtectRoute allowedRoles={["student"]}>
          <MijnProfiel />
        </ProtectRoute>
      } />

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
                <Aanmaak />
            </AdminLayout>
            </ProtectRoute>
          }/>
      </Routes>
    </>
  );
}

export default App;