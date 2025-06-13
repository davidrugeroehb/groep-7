// backend/routes/studentRoutes.js
import express from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  getAllStudenten,
  countAllStudents
} from '../controllers/studentController.js'; // Let op: getAllSpeeddates is hier niet langer nodig

const router = express.Router();

// Ophalen van alle studenten (wordt /api/students)
router.get('/', getAllStudenten);

// Route om totaal aantal studenten op te halen (wordt /api/students/count)
router.get('/count', countAllStudents);

// Route voor studentenprofiel ophalen (wordt /api/students/mijnprofiel/:studentId)
router.get('/mijnprofiel/:studentId', getStudentProfile);

// Route om profiel student up te daten (wordt /api/students/mijnprofiel/:studentId)
router.put('/mijnprofiel/:studentId', updateStudentProfile);

export default router;