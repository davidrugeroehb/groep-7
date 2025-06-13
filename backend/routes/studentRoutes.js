// backend/routes/studentRoutes.js
import express from "express";
import {
  getAllSpeeddates,
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
router.get('/count', countAllStudents);

// Route voor alle speeddates (bestaat al)
router.get('/speeddates', getAllSpeeddates);

// Route voor studentenprofiel ophalen
router.get('/mijnprofiel/:studentId', getStudentProfile);

// Route om profiel student up te daten
router.put('/mijnprofiel/:studentId', updateStudentProfile);


export default router;