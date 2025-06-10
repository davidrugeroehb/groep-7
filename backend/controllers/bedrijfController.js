import Speeddate from '../models/speeddateModel.js'; // Ensure correct path and name

// Function to create a new speeddate
const createSpeeddate = async (req, res) => {
  try {
    // For a real application, bedrijfId would come from an authenticated user's token/session.
    // For now, let's assume it's sent in the request body for simplicity, or hardcoded for testing.
    // Replace req.body.bedrijfId with the actual way you get the company ID (e.g., from a JWT).
    const {
      starttijd,
      eindtijd,
      gespreksduur,
      pauze,
      vakgebied,
      focus,
      opportuniteit,
      talen,
      beschrijving,
      bedrijfId // Assuming the company ID is sent from the frontend
    } = req.body;

    // Basic validation: ensure companyId is provided
    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist om een speeddate aan te maken.' });
    }

    const newSpeeddate = new Speeddate({
      starttijd,
      eindtijd,
      gespreksduur,
      pauze,
      vakgebied,
      focus,
      opportuniteit,
      talen,
      beschrijving,
      bedrijf: bedrijfId, // Link the speeddate to the company ID
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

// Function to get all speeddates for a specific company
const getCompanySpeeddates = async (req, res) => {
  try {
    // Get the company ID from the request parameters (e.g., /api/bedrijf/speeddates/:bedrijfId)
    // Or, more securely, get it from the authenticated user's token/session
    const { bedrijfId } = req.params; // Assuming company ID is in URL params

    // Basic validation
    if (!bedrijfId) {
      return res.status(400).json({ message: 'Bedrijf ID is vereist.' });
    }

    // Find all speeddates where the 'bedrijf' field matches the provided 'bedrijfId'
    // .populate('bedrijf') can be used if you want to fetch company details along with speeddate
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
