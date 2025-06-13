import Speeddate from '../models/speeddateModel.js';
import Bedrijf from '../models/bedrijfModel.js'; // Import Bedrijf model to populate company name

// Functie om een nieuwe speeddate aan te maken met individuele slots
const createSpeeddate = async (req, res) => {
  try {
    const {
      bedrijfId,
      starttijd, // Overall start time of the period
      eindtijd,   // Overall end time of the period
      lokaal,
      vakgebied,
      focus,
      opportuniteit,
      talen,
      beschrijving,
      speeddateSlots, // Array of pre-calculated slots from frontend
    } = req.body;

    if (!bedrijfId || !starttijd || !eindtijd || !lokaal || !vakgebied || !focus || !opportuniteit || !talen || !beschrijving || !speeddateSlots || speeddateSlots.length === 0) {
      return res.status(400).json({ message: 'Alle velden inclusief ten minste één speeddate slot zijn verplicht.' });
    }

    // Check if the company exists
    const bedrijf = await Bedrijf.findById(bedrijfId);
    if (!bedrijf) {
      return res.status(404).json({ message: 'Bedrijf niet gevonden.' });
    }

    const newSpeeddate = new Speeddate({
      bedrijf: bedrijfId,
      starttijd,
      eindtijd,
      lokaal,
      vakgebied,
      focus,
      opportuniteit,
      talen,
      beschrijving,
      slots: speeddateSlots, // Store the array of slots directly
    });

    const savedSpeeddate = await newSpeeddate.save();

    res.status(201).json({
      message: 'Speeddate succesvol aangemaakt met individuele slots!',
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

// Functie om alle speeddates op te halen (voor studentenoverzicht - Speeddates.jsx)
// Populeert ook de bedrijfsnaam en alle slots
const getAllSpeeddates = async (req, res) => {
  try {
    const speeddates = await Speeddate.find({})
      .populate({
        path: 'bedrijf',
        select: 'name', // Only retrieve the name of the company
      })
      .sort({ starttijd: 1 }); // Sort by overall start time for consistency

    // Only return speeddates that have at least one 'open' slot
    // Or filter on the frontend if you want to show all and disable unavailable
    const availableSpeeddates = speeddates.filter(sd => sd.slots.some(slot => slot.status === 'open'));

    res.status(200).json({ speeddates: availableSpeeddates });
  } catch (error) {
    console.error('Fout bij het ophalen van alle speeddates:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van de speeddates.',
      error: error.message,
    });
  }
};

// Functie om speeddates op te halen voor een specifiek bedrijf (voor bedrijf Home.jsx)
const getCompanySpeeddates = async (req, res) => {
  try {
    const { bedrijfId } = req.params;

    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist.' });
    }

    const speeddates = await Speeddate.find({ bedrijf: bedrijfId })
      .populate({
        path: 'bedrijf',
        select: 'name', // Only retrieve the name of the company
      })
      .sort({ createdAt: -1 }); // Sort by creation date or overall start time

    res.status(200).json({ speeddates });
  } catch (error) {
    console.error('Fout bij het ophalen van speeddates voor bedrijf:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van speeddates voor dit bedrijf.',
      error: error.message,
    });
  }
};

// Functie om een speeddate te verwijderen (inclusief alle gekoppelde aanvragen voor de slots)
const deleteSpeeddate = async (req, res) => {
  try {
    const { speeddateId } = req.params;

    const speeddate = await Speeddate.findById(speeddateId);
    if (!speeddate) {
      return res.status(404).json({ message: 'Speeddate niet gevonden.' });
    }

    // Optionally: Before deleting, you might want to notify students whose slots are booked.
    // For now, we'll just delete the associated applications.
    // This requires the Aanvraag model.
    // const Aanvraag = mongoose.model('Aanvraag'); // If Aanvraag model is needed here

    // Delete associated applications for any of the slots within this speeddate
    // Note: This assumes Aanvraag schema has a 'slot' field referring to Speeddate._id (which it now has)
    await Aanvraag.deleteMany({ speeddate: speeddateId }); // Deletes all requests for this main speeddate

    await Speeddate.findByIdAndDelete(speeddateId);

    res.status(200).json({ message: 'Speeddate en alle gekoppelde aanvragen succesvol verwijderd.' });
  } catch (error) {
    console.error('Fout bij het verwijderen van speeddate:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het verwijderen van de speeddate.',
      error: error.message,
    });
  }
};

// Functie om alle speeddates op te tellen (voor admin dashboard)
const countAllSpeeddates = async (req, res) => {
  try {
    const count = await Speeddate.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Fout bij het tellen van speeddates:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het tellen van speeddates.', error: error.message });
  }
};


export {
  createSpeeddate,
  getAllSpeeddates, // Export for student view
  getCompanySpeeddates, // Export for company view
  deleteSpeeddate,
  countAllSpeeddates, // For admin
};