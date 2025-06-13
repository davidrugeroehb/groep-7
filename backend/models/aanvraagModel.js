// backend/models/aanvraagModel.js
import mongoose from 'mongoose';

const aanvraagSchema = new mongoose.Schema({
  speeddate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speeddate',
    required: true,
  },
  slot: { // NEW: Reference to the specific slot within the speeddate
    type: mongoose.Schema.Types.ObjectId,
    required: true, // This is now required
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',
    required: true,
  },
  bedrijf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bedrijf',
    required: true,
  },
  status: {
    type: String,
    enum: ['in behandeling', 'goedgekeurd', 'afgekeurd'],
    default: 'in behandeling',
    required: true,
  },
  // afspraakDetails are now mainly derived from the slot itself,
  // but we keep it for now as it's used in the frontend and might contain
  // additional dynamic info if needed. However, time and lokaal will come from the slot.
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

// We need a unique index for (speeddate, slot, student)
// Or just (slot, student) if a student can only book one specific slot ever
// For "a student can max 1 subspeeddate aanvragen per speeddate",
// the main 'speeddate' field in Aanvraag is already unique per student due to the index below.
// However, the check will be more complex and done in the controller.
aanvraagSchema.index({ speeddate: 1, student: 1 }, { unique: true }); // This index will now prevent a student from applying to the *same main speeddate* more than once.
// We'll also need a check in the controller for applying to different slots of the same main speeddate.

const Aanvraag = mongoose.model('Aanvraag', aanvraagSchema);

export default Aanvraag;