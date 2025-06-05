import React from 'react';
import './index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import About from './pages/About';
import BedrijfSignup from './pages/BedrijfSignup';
import Login from './pages/Login';
import MijnAanvragen from './pages/MijnAanvragen';
import MijnAfspraken from './pages/MijnAfspraken';
import MijnProfiel from './pages/MijnProfiel';
import Speeddates from './pages/Speeddates';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<Navigate to="/speeddates" />} /> // wanneer we naar de localhost gaan gaat het direct naar de homepage dus speeddates
        <Route path="/about" element={<About />} />
        <Route path="/bedrijf-signup" element={<BedrijfSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mijnaanvragen" element={<MijnAanvragen />} />
        <Route path="/mijnafspraken" element={<MijnAfspraken />} />
        <Route path="/mijnprofiel" element={<MijnProfiel />} />
        <Route path="/speeddates" element={<Speeddates />} />
      </Routes>
    </>
  );
}

export default App;