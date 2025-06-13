import Speeddate from '../models/speeddateModel.js';

// Functie om alle speeddates op te tellen
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
  countAllSpeeddates
};