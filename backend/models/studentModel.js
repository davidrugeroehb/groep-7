import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // Bestaande velden:
    // name: { type: String, required: true }, // Optioneel: verwijder 'name' als je voornaam/achternaam apart wilt

    voornaam: { type: String, required: true }, // NIEUW: Voornaam
    achternaam: { type: String, required: true }, // NIEUW: Achternaam

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    opleiding: { type: String, required: true },
    // taal: { type: String, required: true }, // Als dit een enkele taal is
    talen: { type: [String],enum: ["Nederlands","Frans","Engels"] , default: [] }, // NIEUW: Aanbevolen als array voor meerdere talen

    gsm: { type: String }, // NIEUW: GSM nummer
    specialisatie: { type: String }, // NIEUW: Specialisatie (bijv. "Web Development")
  },
  { minimize: false }
);

const studentModel =
  mongoose.models.student || mongoose.model("student", studentSchema);

export default studentModel;
