// backend/routes/studentRoutes.js
import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,

  getAllStudenten, // Deze functie is voor /api/students
  countAllStudents

} from '../controllers/studentController.js';

const router = express.Router();

// Verander dit:
// router.get('/api/studenten', getAllStudenten);


// Naar dit (omdat server.js al /api/students toevoegt):
router.get('/', getAllStudenten); // Ophalen van alle studenten


// ... (rest van de routes blijven hetzelfde, ze zijn al relatief aan de prefix)
// Route om totaal aantal studenten op te halen
// Wordt /api/students/count
router.get('/count', countAllStudents);

// Route voor studentenprofiel ophalen
// Wordt /api/students/mijnprofiel/:studentId
router.get('/mijnprofiel/:studentId', getStudentProfile);

// Route om profiel student up te daten
// Wordt /api/students/mijnprofiel/:studentId
router.put('/mijnprofiel/:studentId', updateStudentProfile);

export default router;