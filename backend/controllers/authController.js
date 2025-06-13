import studentModel from '../models/studentModel.js'; // Import the Student model
import bedrijfModel from '../models/bedrijfModel.js'; // Import the Bedrijf (Company) model - Use 'bedrijfModel' if that's your export name
import bcrypt from 'bcryptjs'; // For password comparison
import jwt from 'jsonwebtoken'; // For generating tokens
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
    user = await adminModel.findOne({ email }); // Zoek in de admin collectie
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        role = 'admin';
      } else {
        return res.status(401).json({ message: 'Verkeerd wachtwoord voor beheerder.' });
      }
    }

    // 2. Als admin niet gevonden, probeer dan als Student
    if (!user) { // Alleen proberen als er nog geen gebruiker is gevonden
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
    if (!user) { // Alleen proberen als er nog geen gebruiker is gevonden
      user = await bedrijfModel.findOne({ email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          role = 'bedrijf';
        } else {
          return res.status(401).json({ message: 'Verkeerd wachtwoord voor bedrijf.' });
        }
      }
    }

//<<<<<<< HEAD
    // 3. vinden van admin
//=======
    // 4. Als gebruiker niet gevonden in welke rol dan ook
//>>>>>>> 9d6255dd790f3f6f6bb672e901c0485fd5e7e3a4
    if (!user) {
      user = await adminModel.findOne({ email })
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        role = 'admin'
      }else{
        return res.status(401).json({message : 'Verkeerd wachtwoord voor admin.'})
      }
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
      name: user.name || 'Onbekend', // Zorg ervoor dat 'name' bestaat voor alle user types
      role: role,
      message: `${role === 'student' ? 'Student' : (role === 'bedrijf' ? 'Bedrijf' : 'Beheerder')} succesvol ingelogd!`
    });

  } catch (err) {
    console.error('Fout bij universele login:', err);
    res.status(500).json({ message: 'Er ging iets mis bij het inloggen.', error: err.message });
  }
};
