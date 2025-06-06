import mongoose from "mongoose";

const bedrijfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adres: { type: String },
  btwNummer: { type: String },
  website: { type: String },
  sector: { type: String },

  contactpersoon: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '0000000000', required: true },
});

const bedrijfModel = mongoose.models.bedrijf || mongoose.model("bedrijf", bedrijfSchema);
export default bedrijfModel;
