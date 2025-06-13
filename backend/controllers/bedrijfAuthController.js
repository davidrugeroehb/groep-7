import bedrijfModel from "../models/bedrijfModel.js";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken"; // Niet nodig in register, alleen in login

// REGISTRATIE
export const registerBedrijf = async (req, res) => {
  try {
    const { name, adres, btwNummer, website, sector, contactpersoon, email, password, phone } = req.body;

    const existing = await bedrijfModel.findOne({ email });
    if (existing) {
      // Controleer of een bedrijf met deze e-mail al bestaat, ongeacht de status
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
      status: 'pending', // NIEUW: Standaardstatus is 'pending' bij registratie
    });

    res.status(201).json({
      message: "Bedrijf succesvol geregistreerd. Wacht op goedkeuring van de beheerder.",
      bedrijfId: nieuwBedrijf._id,
      status: nieuwBedrijf.status // Stuur de status mee
    });
  } catch (err) {
    console.error('Fout bij bedrijfsregistratie:', err);
    res.status(500).json({ message: "Registratie mislukt", error: err.message });
  }
};

// LOGIN (REMOVED - now handled by authController.js)
// export const loginBedrijf = async (req, res) { /* ... */ };