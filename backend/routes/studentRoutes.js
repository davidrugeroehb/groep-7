import express from "express";
import {
  getAllSpeeddates,
  getStudentProfile,
  updateStudentProfile,
  getAllStudenten,
  countAllStudents // Nieuwe functie importeren
} from '../controllers/studentController.js';

const router = express.Router();


router.get('/api/studenten', getAllStudenten);


// Route om totaal aantal studenten op te halen
router.get('/count', countAllStudents);

// Route voor alle speeddates (bestaat al)
router.get('/speeddates', getAllSpeeddates);

// Route voor studentenprofiel ophalen
router.get('/mijnprofiel/:studentId', getStudentProfile);

// Route om profiel student up te daten
router.put('/mijnprofiel/:studentId', updateStudentProfile);


export default router;