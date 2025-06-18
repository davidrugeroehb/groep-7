// backend/models/speeddateModel.js
import mongoose from 'mongoose';

// Define the sub-schema for individual speeddate slots
const slotSchema = new mongoose.Schema({
  startTime: {
    type: String, // e.g., "13:00"
    required: true,
  },
  endTime: {
    type: String, // e.g., "13:15"
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'aangevraagd', 'bevestigd', 'afgekeurd'],
    default: 'open',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student', // Link to the student who booked/requested this specific slot
    default: null,
  },
});

const speeddateSchema = new mongoose.Schema({
  bedrijf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bedrijf',
    required: true,
  },
  starttijd: { // This is the overall period start time
    type: String,
    required: true,
  },
  eindtijd: { // This is the overall end time of the period
    type: String,
    required: true,
  },
  // AANGEPAST: lokaal verwijst nu naar het Lokaal model
  lokaal: {
    type: mongoose.Schema.Types.ObjectId, // Verwijst naar het Lokaal model
    ref: 'Lokaal', // Naam van het model
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Array of sub-speeddate slots
  slots: {
    type: [slotSchema],
    default: [],
  },
});

const Speeddate = mongoose.model('Speeddate', speeddateSchema);

export default Speeddate;