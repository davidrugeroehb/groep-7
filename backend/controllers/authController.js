import studentModel from '../models/studentModel.js'; // Import the Student model
import bedrijfModel from '../models/bedrijfModel.js'; // Import the Bedrijf (Company) model - Use 'bedrijfModel' if that's your export name
import bcrypt from 'bcryptjs'; // For password comparison
import jwt from 'jsonwebtoken'; // For generating tokens

// Unified login function
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail en wachtwoord zijn vereist.' });
    }

    let user = null;
    let role = null;

    // 1. Try to find user as a Student
    user = await studentModel.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        role = 'student';
      } else {
        // If password doesn't match for student, don't try other roles
        return res.status(401).json({ message: 'Verkeerd wachtwoord voor student.' });
      }
    }

    // 2. If not found as Student, try to find user as a Bedrijf (Company)
    if (!user) { // Only try company if student wasn't found
      user = await bedrijfModel.findOne({ email }); // Use 'bedrijfModel' here
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          role = 'bedrijf';
        } else {
          // If password doesn't match for company, don't try other roles
          return res.status(401).json({ message: 'Verkeerd wachtwoord voor bedrijf.' });
        }
      }
    }

    // 3. If user not found in any role
    if (!user) {
      return res.status(404).json({ message: 'Gebruiker niet gevonden. Controleer uw e-mailadres.' });
    }

    // Generate JWT token (assuming JWT_SECRET is set in your .env)
    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Respond with token, user ID, and detected role
    res.json({
      token,
      userId: user._id,
      name: user.name, // Assuming both student and bedrijf models have a 'name' field
      role: role,
      message: `${role === 'student' ? 'Student' : 'Bedrijf'} succesvol ingelogd!`
    });

  } catch (err) {
    console.error('Fout bij universele login:', err);
    res.status(500).json({ message: 'Er ging iets mis bij het inloggen.', error: err.message });
  }
};
