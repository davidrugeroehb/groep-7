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
    ref: 'bedrijf', // <--- WIJZIGING: Hoofdletter 'B' naar kleine letter 'b'
    required: true,
  },
  aangevraagdDoor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Dit is al 'Student' (hoofdletter), dus controleer studentModel.js
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
