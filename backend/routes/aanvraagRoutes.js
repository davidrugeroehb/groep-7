import express from 'express';
import {
  createAanvraag,
  getStudentAanvragen,
  getBedrijfAanvragen,
  updateAanvraagStatus,
  deleteAanvraag,
  getStudentAfspraken,
} from '../controllers/aanvraagController.js';

const router = express.Router();

// Routes voor studenten
router.post('/aanvragen', createAanvraag); // Student dient een aanvraag in
router.get('/aanvragen/student/:studentId', getStudentAanvragen); // Haal alle aanvragen van een specifieke student op
router.delete('/aanvragen/:aanvraagId', deleteAanvraag); // Student annuleert een aanvraag
router.get('/afspraken/student/:studentId', getStudentAfspraken); // Haal alle bevestigde afspraken van een student op

// Routes voor bedrijven
router.get('/aanvragen/bedrijf/:bedrijfId', getBedrijfAanvragen); // Haal alle aanvragen voor een specifiek bedrijf op
router.patch('/aanvragen/:aanvraagId', updateAanvraagStatus); // Bedrijf werkt de status van een aanvraag bij

export default router;
