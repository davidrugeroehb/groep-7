import express from "express";
// Importeer de nieuwe functies voor het profielbeheer
import { getAllSpeeddates, getStudentProfile, updateStudentProfile, getAllStudenten } from '../controllers/studentController.js';

const router = express.Router();

router.get('/studenten', getAllStudenten); //api/studenten moet die getten

// Route om alle speeddates op te halen voor studenten
router.get('/speeddates', getAllSpeeddates);

// NIEUWE ROUTE: Profiel van een specifieke student ophalen
// studentId komt uit de URL parameter (e.g., /api/student/mijnprofiel/654321abcd)
router.get('/mijnprofiel/:studentId', getStudentProfile);

// NIEUWE ROUTE: Profiel van een specifieke student bijwerken
// Gebruik PUT voor volledige vervanging, of PATCH voor gedeeltelijke update
router.put('/mijnprofiel/:studentId', updateStudentProfile);


export default router;
