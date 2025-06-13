import express from "express";
import {
  // Verwijder 'getAllSpeeddates' uit de import, want deze route hoort niet hier.
  getStudentProfile,
  updateStudentProfile,
  getAllStudenten,
  countAllStudents // Nieuwe functie importeren
} from '../controllers/studentController.js';

const router = express.Router();


router.get('/studenten', getAllStudenten);


// Route om totaal aantal studenten op te halen
router.get('/count', countAllStudents);

// Verwijder deze regel:
// router.get('/speeddates', getAllSpeeddates); // <-- DEZE REGEL WORDT VERWIJDERD


// Route voor studentenprofiel ophalen
router.get('/mijnprofiel/:studentId', getStudentProfile);

// Route om profiel student up te daten
router.put('/mijnprofiel/:studentId', updateStudentProfile);


export default router;