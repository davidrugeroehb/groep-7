import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {


    voornaam: { type: String, required: true },
    achternaam: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    opleiding: { type: String, required: true },
    talen: { type: [String],enum: ["Nederlands","Frans","Engels"] , default: [] },

    gsm: { type: String },
    specialisatie: { type: String },
  },
  { minimize: false }
);

const studentModel =
  mongoose.models.student || mongoose.model("student", studentSchema);

export default studentModel;
