import Speeddate from '../models/speeddateModel.js';
import Bedrijf from '../models/bedrijfModel.js';

// Functie om alle GOEDGEKEURDE bedrijven op te halen, inclusief oudere zonder 'status' veld
const getAllBedrijven = async (req, res) => {
  try {
    // Zoek bedrijven met status 'approved' OF die geen 'status' veld hebben (of null is)
    const bedrijven = await Bedrijf.find({
      $or: [
        { status: 'approved' },
        { status: { $exists: false } }, // Bedrijven die het 'status' veld niet hebben
        { status: null } // Bedrijven waarvan het 'status' veld null is
      ]
    }).select('-password'); // Haal alleen goedgekeurde/bestaande bedrijven op, zonder wachtwoorden
    res.status(200).json(bedrijven);
  } catch (error) {
    console.error('Fout bij het ophalen van alle goedgekeurde bedrijven:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het ophalen van bedrijven.', error: error.message });
  }
};

// Functie om ALLE PENDING (afwachtende) bedrijfsaanvragen op te halen
const getAllPendingBedrijfRegistrations = async (req, res) => {
  try {
    const pendingBedrijven = await Bedrijf.find({ status: 'pending' }).select('-password');
    res.status(200).json(pendingBedrijven);
  } catch (error) {
    console.error('Fout bij het ophalen van afwachtende bedrijfsregistraties:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het ophalen van afwachtende bedrijfsregistraties.', error: error.message });
  }
};

// Functie om het AANTAL PENDING (afwachtende) bedrijfsaanvragen te tellen
const countPendingBedrijfRegistrations = async (req, res) => {
  try {
    const count = await Bedrijf.countDocuments({ status: 'pending' });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Fout bij het tellen van afwachtende bedrijfsregistraties:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het tellen van afwachtende bedrijfsregistraties.', error: error.message });
  }
};


// Functie om een bedrijfsaanvraag goed te keuren
const approveBedrijfRegistration = async (req, res) => {
  try {
    const { bedrijfId } = req.params;
    const bedrijf = await Bedrijf.findByIdAndUpdate(bedrijfId, { status: 'approved' }, { new: true });

    if (!bedrijf) {
      return res.status(404).json({ message: 'Bedrijf niet gevonden.' });
    }

    res.status(200).json({ message: 'Bedrijf registratie succesvol goedgekeurd.', bedrijf });
  } catch (error) {
    console.error('Fout bij het goedkeuren van bedrijfsregistratie:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het goedkeuren van de registratie.', error: error.message });
  }
};

// Functie om een bedrijfsaanvraag af te keuren
const rejectBedrijfRegistration = async (req, res) => {
  try {
    const { bedrijfId } = req.params;
    const bedrijf = await Bedrijf.findByIdAndUpdate(bedrijfId, { status: 'rejected' }, { new: true });

    if (!bedrijf) {
      return res.status(404).json({ message: 'Bedrijf niet gevonden.' });
    }

    res.status(200).json({ message: 'Bedrijf registratie succesvol afgewezen.', bedrijf });
  } catch (error) {
    console.error('Fout bij het afwijzen van bedrijfsregistratie:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het afwijzen van de registratie.', error: error.message });
  }
};


// Functie om een nieuwe speeddate aan te maken
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

// Functie om profiel van een specifiek bedrijf op te halen
const getCompanyProfile = async (req, res) => {
  try {
    const { bedrijfId } = req.params;

    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist om profiel op te halen.' });
    }

    const bedrijf = await Bedrijf.findById(bedrijfId).select('-password');

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

// Functie om profiel van een specifiek bedrijf bij te werken
const updateCompanyProfile = async (req, res) => {
  try {
    const { bedrijfId } = req.params;
    const updateData = req.body;

    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist om profiel bij te werken.' });
    }

    delete updateData.password;

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

// Functie voor het tellen van ALLE goedgekeurde bedrijven (voor dashboard)
const countAllBedrijven = async (req, res) => {
  try {
    const count = await Bedrijf.countDocuments({
      $or: [
        { status: 'approved' },
        { status: { $exists: false } }, // Bedrijven die het 'status' veld niet hebben
        { status: null } // Bedrijven waarvan het 'status' veld null is
      ]
    });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Fout bij het tellen van bedrijven:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het tellen van bedrijven.', error: error.message });
  }
};


export {
  createSpeeddate,
  getCompanySpeeddates,
  getCompanyProfile,
  updateCompanyProfile,
  countAllBedrijven, // Algemene count goedgekeurde bedrijven
  getAllBedrijven, // Alle goedgekeurde bedrijven ophalen
  getAllPendingBedrijfRegistrations, // Alle afwachtende registraties ophalen
  countPendingBedrijfRegistrations, // Aantal afwachtende registraties tellen
  approveBedrijfRegistration, // Registratie goedkeuren
  rejectBedrijfRegistration, // Registratie afwijzen
};