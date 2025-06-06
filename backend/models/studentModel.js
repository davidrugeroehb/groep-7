import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    richting: { type: String, required: true },
    taal: { type: String, required: true },
  },
  { minimize: false }
);

const studentModel =
  mongoose.models.docter || mongoose.model("student", studentSchema);

export default studentModel;
