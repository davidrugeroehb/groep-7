import bedrijfModel from "../models/bedrijfModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTRATIE (Keep this, as registration is separate from login)
export const registerBedrijf = async (req, res) => {
  try {
    const { name, adres, btwNummer, website, sector, contactpersoon, email, password, phone } = req.body;

    const existing = await bedrijfModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "E-mailadres al in gebruik" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nieuwBedrijf = await bedrijfModel.create({
      name,
      adres,
      btwNummer,
      website,
      sector,
      contactpersoon,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({ message: "Bedrijf geregistreerd", bedrijfId: nieuwBedrijf._id });
  } catch (err) {
    res.status(500).json({ message: "Registratie mislukt", error: err.message });
  }
};

// LOGIN (REMOVED - now handled by authController.js)
// export const loginBedrijf = async (req, res) => { /* ... */ };
