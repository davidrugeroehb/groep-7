// backend/models/lokaalModel.js
import mongoose from 'mongoose';

// Schema voor de bezette tijdsblokken per lokaal per speeddate
// Dit wordt een subdocument in het lokaalModel.
const occupiedSlotSchema = new mongoose.Schema({
  speeddateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speeddate',
    required: true,
  },
  // We slaan de specifieke slot start- en eindtijd op
  // voor het geval een hoofdspeeddate meerdere sub-slots bezet.
  startTime: {
    type: String, // bijv. "13:00"
    required: true,
  },
  endTime: {
    type: String, // bijv. "13:30"
    required: true,
  },
  // Optioneel: student die dit slot heeft geboekt, voor auditing
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
    default: null,
  },
  // Dit kan de specifieke slot_id zijn van de sub-speeddate
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});


const lokaalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Lokaalnamen moeten uniek zijn
    trim: true,
  },
  capacity: { // Aantal speeddates (bedrijven) dat tegelijk in dit lokaal kan plaatsvinden
    type: Number,
    required: true,
    min: 1, // Minimaal 1 bedrijf per lokaal
  },
  // Array om de bezette tijdsblokken vast te leggen
  // Dit zijn de 'occupiedSlots' voor de _enkele_ speeddate dag.
  occupiedSlots: {
    type: [occupiedSlotSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lokaal = mongoose.model('Lokaal', lokaalSchema);

export default Lokaal;