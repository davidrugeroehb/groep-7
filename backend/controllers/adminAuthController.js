// backend/controllers/adminAuthController.js
import adminModel from '../models/adminModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Controleer of e-mail en wachtwoord zijn opgegeven
    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail en wachtwoord zijn vereist.' });
    }

    // Zoek de admin op basis van e-mail
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Ongeldige inloggegevens.' });
    }

    // Vergelijk het opgegeven wachtwoord met het gehashte wachtwoord
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ongeldige inloggegevens.' });
    }

    // Genereer een JWT-token
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Stuur het token en admin-informatie terug
    res.status(200).json({
      token,
      userId: admin._id, // Stuur de ID mee, nodig voor frontend profiel ophalen
      name: admin.name || admin.email,
      role: 'admin',
      message: 'Admin succesvol ingelogd!'
    });

  } catch (error) {
    console.error('Fout bij admin login:', error);
    res.status(500).json({ message: 'Er ging iets mis bij het inloggen.', error: error.message });
  }
};

// Als er andere admin authenticatie functies zijn, exporteer ze hier
// export const registerAdmin = async (req, res) => { ... };