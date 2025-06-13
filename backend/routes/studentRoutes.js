import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  getAllStudenten,
  countAllStudents,
  // getAllSpeeddates // Let op: deze is al verplaatst naar speeddateRoutes.js
} from '../controllers/studentController.js';

const router = express.Router();


// Haal alle studenten op
// De prefix in server.js is /api/students, dus deze route wordt /api/students/
router.get('/', getAllStudenten); // <-- Aangepast van '/api/studenten' naar '/'


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