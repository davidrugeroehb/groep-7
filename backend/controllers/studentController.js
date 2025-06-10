import Speeddate from '../models/speeddateModel.js'; // Ensure correct path and name

// Function to get all speeddates for students
const getAllSpeeddates = async (req, res) => {
  try {
    // Find all speeddates without any filtering
    // .populate('bedrijf') can be used if you want to fetch company details along with speeddate
    const speeddates = await Speeddate.find({});

    res.status(200).json({
      message: 'Alle speeddates succesvol opgehaald.',
      speeddates: speeddates,
    });
  } catch (error) {
    console.error('Fout bij het ophalen van alle speeddates:', error);
    res.status(500).json({
      message: 'Er ging iets mis bij het ophalen van alle speeddates.',
      error: error.message,
    });
  }
};

export { getAllSpeeddates };