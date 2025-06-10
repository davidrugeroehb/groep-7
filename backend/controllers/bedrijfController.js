import Speeddate from '../models/speeddateModel.js'; // Zorg voor correct pad en naam

// Functie om een nieuwe speeddate aan te maken
const createSpeeddate = async (req, res) => {
  try {
    // Haal speeddate gegevens uit de request body
    // gespreksduur en pauze zijn verwijderd
    const {
      starttijd,
      eindtijd,
      vakgebied,
      focus,
      opportuniteit,
      talen,
      beschrijving,
      bedrijfId // Verwacht nog steeds bedrijfId van de frontend
    } = req.body;

    // Basisvalidatie: zorg ervoor dat bedrijfId is opgegeven
    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist om een speeddate aan te maken.' });
    }

    const newSpeeddate = new Speeddate({
      starttijd,
      eindtijd,
      // gespreksduur en pauze zijn verwijderd uit de creatie van de speeddate
      vakgebied,
      focus,
      opportuniteit,
      talen,
      beschrijving,
      bedrijf: bedrijfId, // Koppel de speeddate aan het bedrijfs-ID
    });

    const savedSpeeddate = await newSpeeddate.save();

    res.status(201).json({
      message: 'Speeddate succesvol aangemaakt!',
      speeddate: savedSpeeddate,
    });
  } catch (error) {
    console.error('Fout bij het aanmaken van speeddate:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het aanmaken van de speeddate.',
      error: error.message,
    });
  }
};

// Functie om alle speeddates voor een specifiek bedrijf op te halen
const getCompanySpeeddates = async (req, res) => {
  try {
    const { bedrijfId } = req.params;

    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist.' });
    }

    const speeddates = await Speeddate.find({ bedrijf: bedrijfId });

    res.status(200).json({
      message: 'Speeddates voor bedrijf succesvol opgehaald.',
      speeddates: speeddates,
    });
  } catch (error) {
    console.error('Fout bij het ophalen van speeddates voor bedrijf:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van speeddates voor dit bedrijf.',
      error: error.message,
    });
  }
};

export { createSpeeddate, getCompanySpeeddates };
