import studentModel from "../models/studentModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Enkel login voor studenten
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await studentModel.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student niet gevonden" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Verkeerd wachtwoord" });
    }

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, studentId: student._id, name: student.name });
  } catch (err) {
    res.status(500).json({ message: "Fout bij login", error: err.message });
  }
};
