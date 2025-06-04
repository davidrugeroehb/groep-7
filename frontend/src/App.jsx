import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import About from './pages/About';
import Login from './pages/Login';
import MijnAanvragen from './pages/MijnAanvragen';
import MijnAfspraken from './pages/MijnAfspraken';
import MijnProfiel from './pages/MijnProfiel';
import Speeddates from './pages/Speeddates';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mijnaanvragen" element={<MijnAanvragen />} />
        <Route path="/mijnafspraken" element={<MijnAfspraken />} />
        <Route path="/mijnprofiel" element={<MijnProfiel />} />
        <Route path="/speeddates" element={<Speeddates />} />
      </Routes>
    </Router>
  );
}

export default App;