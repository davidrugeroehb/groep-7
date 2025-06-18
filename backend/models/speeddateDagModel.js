// backend/models/SpeeddateDagModel.js
import mongoose from 'mongoose';

const speeddateDagSchema = new mongoose.Schema({
  // De unieke ID garandeert dat er maar één document is voor deze instellingen
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    // Gebruik een vaste ObjectId om te garanderen dat er maar één document is.
    // Dit is een willekeurig gekozen maar consistente ID.
    // Voorbeeld ID, zorg dat deze uniek is in je database als je meerdere vaste ID's gebruikt.
    default: () => new mongoose.Types.ObjectId("60c72b2f9b1d8e001c8a1b2d"),
  },
  dayStartTime: {
    type: String, // bijv. "09:00"
    required: true,
    default: "09:00", // Standaardwaarde
  },
  dayEndTime: {
    type: String, // bijv. "17:00"
    required: true,
    default: "17:00", // Standaardwaarde
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const SpeeddateDag = mongoose.model('SpeeddateDag', speeddateDagSchema);

export default SpeeddateDag;