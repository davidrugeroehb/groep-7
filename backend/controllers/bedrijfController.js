import Speeddate from '../models/speeddateModel.js';
import Bedrijf from '../models/bedrijfModel.js';

// Functie om alle bedrijven op te halen
const getAllBedrijven = async (req, res) => {
  try {
    const bedrijven = await Bedrijf.find().select('-password'); // Haal alle bedrijven op, zonder wachtwoorden
    res.status(200).json(bedrijven);
  } catch (error) {
    console.error('Fout bij het ophalen van alle bedrijven:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het ophalen van bedrijven.', error: error.message });
  }
};


// NIEUWE FUNCTIE: Tellen van alle bedrijven (deze is al correct)
const countAllBedrijven = async (req, res) => {
  try {
    const count = await Bedrijf.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Fout bij het tellen van bedrijven:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het tellen van bedrijven.', error: error.message });
  }
};

// Functie om een nieuwe speeddate aan te maken (bestaat al)
const createSpeeddate = async (req, res) => {
  try {
    const {
      starttijd,
      eindtijd,
      lokaal,
      vakgebied,
      focus,
      opportuniteit,
      talen,
      beschrijving,
      bedrijfId
    } = req.body;

    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist om een speeddate aan te maken.' });
    }
    if (!lokaal) {
        return res.status(400).json({ message: 'Lokaal is vereist om een speeddate aan te maken.' });
    }

    const newSpeeddate = new Speeddate({
      starttijd,
      eindtijd,
      lokaal,
      vakgebied,
      focus,
      opportuniteit,
      talen,
      beschrijving,
      bedrijf: bedrijfId,
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

// Functie om alle speeddates voor een specifiek bedrijf op te halen (bestaat al)
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

// NIEUWE FUNCTIE: Profiel van een specifiek bedrijf ophalen (bestaat al)
const getCompanyProfile = async (req, res) => {
  try {
    const { bedrijfId } = req.params; // ID komt uit de URL

    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist om profiel op te halen.' });
    }

    const bedrijf = await Bedrijf.findById(bedrijfId).select('-password'); // Haal bedrijf op, exclusief wachtwoord

    if (!bedrijf) {
      return res.status(404).json({ message: 'Bedrijf niet gevonden.' });
    }

    res.status(200).json({
      message: 'Bedrijf profiel succesvol opgehaald.',
      profile: bedrijf,
    });
  } catch (error) {
    console.error('Fout bij het ophalen van bedrijf profiel:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van het bedrijf profiel.',
      error: error.message,
    });
  }
};

// NIEUWE FUNCTIE: Profiel van een specifiek bedrijf bijwerken (bestaat al)
const updateCompanyProfile = async (req, res) => {
  try {
    const { bedrijfId } = req.params;
    const updateData = req.body; // De gegevens die moeten worden bijgewerkt

    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist om profiel bij te werken.' });
    }

    // Voorkom dat wachtwoord direct wordt bijgewerkt via deze route
    delete updateData.password;
    // Overweeg ook om email niet via deze route te laten bijwerken als het 'unique' is.

    const updatedBedrijf = await Bedrijf.findByIdAndUpdate(bedrijfId, updateData, { new: true, runValidators: true }).select('-password');

    if (!updatedBedrijf) {
      return res.status(404).json({ message: 'Bedrijf niet gevonden.' });
    }

    res.status(200).json({
      message: 'Bedrijf profiel succesvol bijgewerkt.',
      profile: updatedBedrijf,
    });
  } catch (error) {
    console.error('Fout bij het bijwerken van bedrijf profiel:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het bijwerken van het bedrijf profiel.',
      error: error.message,
    });
  }
};

export {
  createSpeeddate,
  getCompanySpeeddates,
  getCompanyProfile,
  updateCompanyProfile,
  countAllBedrijven,
  getAllBedrijven // Export de nieuwe functie
};