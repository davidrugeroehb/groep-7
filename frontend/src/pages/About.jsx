import React from 'react';
import teamImage from '../assets/team-placeholder.png'; // zorg dat je een echte image gebruikt

const About = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-16 gap-10">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-4">Career Match</h1>
          <p className="text-lg leading-relaxed">
            Career Match is een platform ontworpen door studenten van de Erasmushogeschool Brussel. Ons doel is om het sollicitatieproces eenvoudiger, sneller en menselijker te maken. Wij bieden een gebruiksvriendelijke tool waarmee studenten zich kunnen voorbereiden en bedrijven snel in contact komen met geschikte kandidaten.
          </p>
        </div>
        <div className="md:w-1/2">
          <img src={teamImage} alt="Ons team"/>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 py-12 border-t">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-2">Contacteer ons</h2>
          <p className="mb-6">Heb je een vraag of voorstel? Laat iets horen!</p>

          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <span>📧</span>
              <span>
  E-mail:{" "}
  <a href="mailto:info@careerlaunch.be" className="text-blue-600 underline hover:text-blue-800">
    info@careerlaunch.be
  </a>
</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <span>Tel: +32 470 00 00 00</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📍</span>
              <span>Adres: Nijverheidskaai 170, 1070 Brussel</span>
            </li>
          </ul>

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
      </section>
    </div>
  );
};

export default About;