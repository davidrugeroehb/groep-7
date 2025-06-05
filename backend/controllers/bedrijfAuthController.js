import bedrijfModel from "../models/bedrijfModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTRATIE
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

// LOGIN
export const loginBedrijf = async (req, res) => {
  try {
    const { email, password } = req.body;

    const bedrijf = await bedrijfModel.findOne({ email });
    if (!bedrijf) {
      return res.status(404).json({ message: "Bedrijf niet gevonden" });
    }

    const isMatch = await bcrypt.compare(password, bedrijf.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Verkeerd wachtwoord" });
    }

    const token = jwt.sign(
      { id: bedrijf._id, role: "bedrijf" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, bedrijfId: bedrijf._id, name: bedrijf.name });
  } catch (err) {
    res.status(500).json({ message: "Login mislukt", error: err.message });
  }
};
