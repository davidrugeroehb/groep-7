import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  getAllStudenten,
  countAllStudents,
  deleteStudent // Importeer de nieuwe functie
} from '../controllers/studentController.js';

const router = express.Router();

router.get('/', getAllStudenten);
router.get('/count', countAllStudents);
router.get('/mijnprofiel/:studentId', getStudentProfile);
router.put('/mijnprofiel/:studentId', updateStudentProfile);

// NIEUWE ROUTE: Verwijderen van een student
// Deze route is verantwoordelijk voor DELETE /api/students/:studentId
router.delete('/:studentId', deleteStudent); // <-- Zorg dat deze regel correct is en een DELETE methode heeft!

export default router;