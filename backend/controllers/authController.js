import studentModel from '../models/studentModel.js';
import bedrijfModel from '../models/bedrijfModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import adminModel from '../models/adminModel.js';


// Unified login function
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail en wachtwoord zijn vereist.' });
    }

    let user = null;
    let role = null;

    // 1. Probeer de gebruiker te vinden als een Admin
    user = await adminModel.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        role = 'admin';
      } else {
        return res.status(401).json({ message: 'Verkeerd wachtwoord voor beheerder.' });
      }
    }

    // 2. Als admin niet gevonden, probeer dan als Student
    if (!user) {
      user = await studentModel.findOne({ email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          role = 'student';
        } else {
          return res.status(401).json({ message: 'Verkeerd wachtwoord voor student.' });
        }
      }
    }

    // 3. Als student niet gevonden, probeer dan als Bedrijf
    if (!user) {
      user = await bedrijfModel.findOne({ email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          // Controleer de status van het bedrijf, inclusief oudere bedrijven zonder status
          if (user.status === 'pending') {
            return res.status(403).json({ message: 'Je account is nog in afwachting van goedkeuring door de beheerder.' });
          }
          if (user.status === 'rejected') {
            return res.status(403).json({ message: 'Sorry, je bedrijfsregistratie is niet goedgekeurd door de beheerder.' });
          }
          // Als status 'approved' is OF als het status veld niet bestaat (oudere bedrijven) OF null is
          if (user.status === 'approved' || user.status === undefined || user.status === null) {
              role = 'bedrijf';
          } else {
              // Onverwachte status, of een status die geen login toestaat
              return res.status(403).json({ message: 'Onbekende status voor je account. Neem contact op met de beheerder.' });
          }
        } else {
          return res.status(401).json({ message: 'Verkeerd wachtwoord voor bedrijf.' });
        }
      }
    }

    // Als gebruiker niet gevonden in welke rol dan ook
    if (!user) {
      return res.status(404).json({ message: 'Gebruiker niet gevonden. Controleer je e-mailadres.' });
    }

    // Genereer JWT token (aannemende dat JWT_SECRET is ingesteld in je .env)
    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Stuur token, user ID en gedetecteerde rol terug
    res.json({
      token,
      userId: user._id,
      name: user.name || (user.voornaam ? `${user.voornaam} ${user.achternaam}` : 'Onbekend'), // Gebruik voornaam/achternaam voor studenten
      role: role,
      message: `${role === 'student' ? 'Student' : (role === 'bedrijf' ? 'Bedrijf' : 'Beheerder')} succesvol ingelogd!`,
      status: user.status // Stuur de status van het bedrijf mee
    });

  } catch (err) {
    console.error('Fout bij universele login:', err);
    res.status(500).json({ message: 'Er ging iets mis bij het inloggen.', error: err.message });
  }
};