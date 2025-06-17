import React, { useState, useEffect } from "react";
import basis from '../assets/basis.png';

function Basis() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
    
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Career Match</h1>
                {/* Inleiding */}
            <p className="text-gray-700 mb-6 leading-relaxed">
                <strong>Career Match</strong> is een platform ontworpen door studenten van de Erasmushogeschool Brussel.
                Ons doel is om het sollicitatieproces eenvoudiger, sneller en menselijker te maken.
                We verbinden studenten en bedrijven op een vlotte en efficiënte manier via speeddates.
            </p>
            <hr/>
        </div>
        <img src={basis} alt="foto van studenten van ehb die praten met een verandwoordelijke van een bedrijf" className="mt-8 max-w-full w-full md:w-2/3 rounded-xl shadow-md object-cover" />
    </div>
  );
}

export default Basis;