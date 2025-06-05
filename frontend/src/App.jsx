import React, { createContext } from 'react';
import './index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import bedrijfAfbeelding from './assets/bedrijf.png';


import About from './pages/About';
import Login from './pages/Login';
import MijnAanvragen from './pages/MijnAanvragen';
import MijnAfspraken from './pages/MijnAfspraken';
import MijnProfiel from './pages/MijnProfiel';
import Speeddates from './pages/Speeddates';


export const AppContext = createContext();

const mockBedrijven = [
  {
    naam: "Bedrijf A",
    focus: "IT",
    image: bedrijfAfbeelding
  },
  {
    naam: "Bedrijf B",
    focus: "Marketing",
    image: bedrijfAfbeelding
  }
];

function App() {
  return (
    <AppContext.Provider value={{ bedrijven: mockBedrijven }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mijnaanvragen" element={<MijnAanvragen />} />
        <Route path="/mijnafspraken" element={<MijnAfspraken />} />
        <Route path="/mijnprofiel" element={<MijnProfiel />} />
        <Route path="/speeddates" element={<Speeddates />} />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
