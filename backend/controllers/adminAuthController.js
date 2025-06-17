import adminModel from '../models/adminModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Functie voor Admin Login (DEZE LIJN STAAT NIET MEER ALS 'export const')
const loginAdmin = async (req, res) => { // <-- Verwijder 'export' hier
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail en wachtwoord zijn vereist.' });
    }

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Ongeldige inloggegevens.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ongeldige inloggegevens.' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      token,
      userId: admin._id,
      name: admin.name || admin.email,
      role: 'admin',
      message: 'Admin succesvol ingelogd!'
    });

  } catch (error) {
    console.error('Fout bij admin login:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het inloggen.', error: error.message });
  }
};

// Admin Registratie functie
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Naam, e-mail en wachtwoord zijn vereist.' });
    }

    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'E-mailadres is al in gebruik voor een administrator.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await adminModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Nieuwe administrator succesvol aangemaakt!',
      adminId: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
    });
  } catch (error) {
    console.error('Fout bij admin registratie:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het aanmaken van de administrator.', error: error.message });
  }
};

// Export alle functies (inclusief loginAdmin en registerAdmin hieronder)
export { loginAdmin, registerAdmin }; // <-- Zorg dat loginAdmin en registerAdmin hier geëxporteerd worden