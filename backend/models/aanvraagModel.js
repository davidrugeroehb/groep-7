import mongoose from 'mongoose';

const aanvraagSchema = new mongoose.Schema({
  speeddate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speeddate',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student', // <--- WIJZIGING: Hoofdletter 'S' naar kleine letter 's'
    required: true,
  },
  bedrijf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bedrijf', // <--- WIJZIGING: Hoofdletter 'B' naar kleine letter 'b'
    required: true,
  },
  status: {
    type: String,
    enum: ['in behandeling', 'goedgekeurd', 'afgekeurd'],
    default: 'in behandeling',
    required: true,
  },
  afspraakDetails: {
    tijd: {
      type: String,
    },
    lokaal: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

aanvraagSchema.index({ speeddate: 1, student: 1 }, { unique: true });

const Aanvraag = mongoose.model('Aanvraag', aanvraagSchema);

export default Aanvraag;
