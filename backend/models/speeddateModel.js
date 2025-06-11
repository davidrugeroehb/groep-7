import mongoose from 'mongoose';

const speeddateSchema = new mongoose.Schema({
  starttijd: {
    type: String,
    required: true,
  },
  eindtijd: {
    type: String,
    required: true,
  },
  lokaal: { // NIEUW: Lokaal veld
    type: String,
    required: true, // Maak dit verplicht als het altijd ingevuld moet worden
  },
  vakgebied: {
    type: String,
    required: true,
  },
  focus: {
    type: String,
    required: true,
  },
  opportuniteit: {
    type: [String],
    default: [],
  },
  talen: {
    type: [String],
    default: [],
  },
  beschrijving: {
    type: String,
    required: true,
  },
  bedrijf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bedrijf', // Klein letter 'b' conform eerdere fix
    required: true,
  },
  aangevraagdDoor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student', // Klein letter 's' conform eerdere fix
    default: null,
  },
  status: {
    type: String,
    enum: ['open', 'aangevraagd', 'bevestigd'],
    default: 'open',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Speeddate = mongoose.model('Speeddate', speeddateSchema);

export default Speeddate;
