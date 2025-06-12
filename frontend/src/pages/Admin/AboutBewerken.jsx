import React, { useEffect, useState } from 'react';
import teamImage from '../assets/team-placeholder.png';

function About() {
  const [profiel, setProfiel] = useState(null);
  const [error, setError] = useState(null);
  const [editableText, setEditableText] = useState(
    "Career Match is een platform ontworpen door studenten van de Erasmushogeschool Brussel. Ons doel is om het sollicitatieproces eenvoudiger, sneller en menselijker te maken. We verbinden studenten en bedrijven op een vlotte en efficiënte manier via speeddates."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [Tekst, setTekst] = useState('');
  useEffect(()=>{ //fetch de about
    const fetchAbout=async()=>{
      try{
          const res = await fetch("http://localhost:4000/api/about");
          const data = await res.json();
          setEditableText(data.tekst_about);
      }catch(error){
        console.error('Fout bij het ophalen van About')

      }
    }
    fetchAbout();
  });

  useEffect(() => {
    const fetchProfiel = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/student/mijnprofiel', {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Profiel ophalen mislukt.');
        }

        const data = await res.json();
        setProfiel(data);
      } catch (err) {
        console.error(err);
        setError('Fout bij ophalen van je profiel.');
      }
    };

    fetchProfiel();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setTekst(editableText);
  };

  const handleSaveClick = async () => {
    try{
      const res = await fetch("http://localhost:4000/api/about", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tekst: Tekst }),
    });
    if (!res.ok) {
      throw new Error("Fout bij opslaan van tekst.");
    }
    const data = await res.json();
    setEditableText(data.tekst_about);
    setIsEditing(false);
    }catch (error){
      console.error('Fout bij het opslaan');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!profiel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-lg">Bezig met laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">

        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Over Career Match
        </h1>

        {/* Bewerken knop enkel voor admins */}
        {profiel.role === 'admin' && !isEditing && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleEditClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Bewerken
            </button>
          </div>
        )}

        {/* Tekstblok of input veld */}
        <div className="text-gray-700 mb-6 leading-relaxed">
          {isEditing ? (
            <>
              <textarea
                value={Tekst}
                onChange={(e) => setTekst(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                rows={6}
              />
              <div className="flex gap-4">
                <button
                  onClick={handleSaveClick}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Opslaan
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Annuleren
                </button>
              </div>
            </>
          ) : (
            <p>{editableText}</p>
          )}
        </div>

        {/* Team afbeelding */}
        <div className="mb-8 text-center">
          <img
            src={teamImage}
            alt="Het Career Match team"
            className="inline-block max-h-64 rounded-lg shadow-md"
          />
        </div>

        {/* Contactgegevens */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contact</h2>

        <ul className="space-y-3 text-gray-700">
          <li>
            📧 E-mail:{" "}
            <a
              href="mailto:info@careerlaunch.be"
              className="text-blue-600 underline hover:text-blue-800"
            >
              info@careerlaunch.be
            </a>
          </li>
          <li>📞 Tel: +32 470 00 00 00</li>
          <li>📍 Adres: Nijverheidskaai 170, 1070 Brussel</li>
        </ul>

        {/* Google Maps */}
        <div className="mt-6">
          <iframe
            title="Kaart locatie"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2517.9287067726114!2d4.327926115746654!3d50.85563397953248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c4853ac99215%3A0x16423c3dc1b2e1b8!2sNijverheidskaai%20170%2C%201070%20Anderlecht!5e0!3m2!1snl!2sbe!4v1685557777777"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default About;
