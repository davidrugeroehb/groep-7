// backend/controllers/lokaalController.js
import Lokaal from '../models/lokaalModel.js';

// Functie om een nieuw lokaal toe te voegen
const createLokaal = async (req, res) => {
  try {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({ message: 'Naam en capaciteit zijn verplicht voor een lokaal.' });
    }

    // Controleer of de lokaalnaam al bestaat
    const existingLokaal = await Lokaal.findOne({ name: name });
    if (existingLokaal) {
      return res.status(409).json({ message: `Lokaal met naam '${name}' bestaat al.` });
    }

    const newLokaal = new Lokaal({ name, capacity });
    const savedLokaal = await newLokaal.save();

    res.status(201).json({
      message: 'Lokaal succesvol aangemaakt!',
      lokaal: savedLokaal,
    });
  } catch (error) {
    console.error('Fout bij het aanmaken van lokaal:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het aanmaken van het lokaal.',
      error: error.message,
    });
  }
};

// Functie om alle lokalen op te halen
const getAllLokalen = async (req, res) => {
  try {
    // AANGEPAST: Selecteer nu ook expliciet de 'occupiedSlots'
    const lokalen = await Lokaal.find({}).select('name capacity occupiedSlots').sort({ name: 1 }); // Sorteren op naam
    res.status(200).json({ lokalen });
  } catch (error) {
    console.error('Fout bij het ophalen van lokalen:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van de lokalen.',
      error: error.message,
    });
  }
};

// Functie om een specifiek lokaal op ID op te halen
const getLokaalById = async (req, res) => {
  try {
    const { id } = req.params;
    // AANGEPAST: Selecteer nu ook expliciet de 'occupiedSlots'
    const lokaal = await Lokaal.findById(id).select('name capacity occupiedSlots');

    if (!lokaal) {
      return res.status(404).json({ message: 'Lokaal niet gevonden.' });
    }
    res.status(200).json({ lokaal });
  } catch (error) {
    console.error('Fout bij het ophalen van lokaal per ID:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van het lokaal.',
      error: error.message,
    });
  }
};

// Functie om een lokaal bij te werken
const updateLokaal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({ message: 'Naam en capaciteit zijn verplicht.' });
    }

    const updatedLokaal = await Lokaal.findByIdAndUpdate(
      id,
      { name, capacity },
      { new: true, runValidators: true } // Return updated document and run schema validators
    ).select('name capacity occupiedSlots'); // AANGEPAST: Selecteer ook occupiedSlots bij return

    if (!updatedLokaal) {
      return res.status(404).json({ message: 'Lokaal niet gevonden.' });
    }

    res.status(200).json({
      message: 'Lokaal succesvol bijgewerkt!',
      lokaal: updatedLokaal,
    });
  } catch (error) {
    console.error('Fout bij het bijwerken van lokaal:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het bijwerken van het lokaal.',
      error: error.message,
    });
  }
};

// Functie om een lokaal te verwijderen
const deleteLokaal = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLokaal = await Lokaal.findByIdAndDelete(id);

    if (!deletedLokaal) {
      return res.status(404).json({ message: 'Lokaal niet gevonden.' });
    }

    // TO DO: Overweeg wat te doen met speeddates die dit lokaal gebruiken
    // Opties:
    // 1. Voorkomen dat een lokaal met actieve speeddates wordt verwijderd.
    // 2. Speeddates die dit lokaal gebruiken, op 'lokaal onbekend' zetten of markeren.
    // Voor nu: alleen het lokaal verwijderen.
    // BELANGRIJK: Als je lokaal verwijdert, zullen speeddates die naar dit lokaal verwijzen, een ongeldige referentie hebben.
    // Je moet mogelijk ook de speeddates bijwerken om de lokaalreferentie te verwijderen of op null te zetten.

    res.status(200).json({ message: 'Lokaal succesvol verwijderd.' });
  } catch (error) {
    console.error('Fout bij het verwijderen van lokaal:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het verwijderen van het lokaal.',
      error: error.message,
    });
  }
};

export {
  createLokaal,
  getAllLokalen,
  getLokaalById,
  updateLokaal,
  deleteLokaal,
};