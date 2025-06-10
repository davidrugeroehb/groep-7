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
  gespreksduur: {
    type: String,
    required: true,
  },
  pauze: {
    type: Boolean,
    default: false,
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
  // Crucial for linking to the company
  bedrijf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bedrijf', // Assuming your company model is named 'Bedrijf'
    required: true, // Making it required to ensure linkage
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Speeddate = mongoose.model('Speeddate', speeddateSchema);

export default Speeddate;
