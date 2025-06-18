// backend/controllers/speeddateDagController.js
import SpeeddateDag from '../models/SpeeddateDagModel.js';
import mongoose from 'mongoose'; // NIEUW: Importeer mongoose

// Functie om de globale speeddate dag instellingen op te halen
const getSpeeddateDagSettings = async (req, res) => {
  try {
    const settings = await SpeeddateDag.findOne({});

    if (!settings) {
      return res.status(404).json({ message: 'Globale speeddate dag instellingen niet gevonden. Gelieve deze in te stellen.' });
    }

    res.status(200).json({
      message: 'Globale speeddate dag instellingen succesvol opgehaald.',
      settings: settings,
    });
  } catch (error) {
    console.error('Fout bij het ophalen van globale speeddate dag instellingen:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van de instellingen.',
      error: error.message,
    });
  }
};

// Functie om de globale speeddate dag instellingen bij te werken of aan te maken
const updateSpeeddateDagSettings = async (req, res) => {
  try {
    const { dayStartTime, dayEndTime } = req.body;

    if (!dayStartTime || !dayEndTime) {
      return res.status(400).json({ message: 'Starttijd en eindtijd van de dag zijn verplicht.' });
    }

    // Gebruik findOneAndUpdate met upsert: true om te garanderen dat er maar één document is
    const settingsId = new mongoose.Types.ObjectId("60c72b2f9b1d8e001c8a1b2d");

    const updatedSettings = await SpeeddateDag.findOneAndUpdate(
      { _id: settingsId },
      { dayStartTime, dayEndTime, lastUpdated: new Date() },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      message: 'Globale speeddate dag instellingen succesvol bijgewerkt!',
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Fout bij het bijwerken van globale speeddate dag instellingen:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het bijwerken van de instellingen.',
      error: error.message,
    });
  }
};

export {
  getSpeeddateDagSettings,
  updateSpeeddateDagSettings,
};