import express from 'express';
import {
  createAanvraag,
  getStudentAanvragen,
  getBedrijfAanvragen,
  updateAanvraagStatus,
  deleteAanvraag,
  getStudentAfspraken,
  countPendingAanvragen,
  getAllPendingAanvragen,
} from '../controllers/aanvraagController.js';

const router = express.Router();

// Routes voor studenten
router.post('/', createAanvraag); // Devient /api/aanvragen
router.get('/student/:studentId', getStudentAanvragen); // Devient /api/aanvragen/student/:studentId
router.delete('/:aanvraagId', deleteAanvraag); // Devient /api/aanvragen/:aanvraagId
router.get('/afspraken/student/:studentId', getStudentAfspraken); // Devient /api/aanvragen/afspraken/student/:studentId

// Routes voor bedrijven
router.get('/bedrijf/:bedrijfId', getBedrijfAanvragen); // Devient /api/aanvragen/bedrijf/:bedrijfId
router.patch('/:aanvraagId', updateAanvraagStatus); // Devient /api/aanvragen/:aanvraagId

// NIEUWE ROUTES VOOR ADMIN (CORRIGÉES)
// Route voor aantal aanvragen in afwachting
router.get('/pending/count', countPendingAanvragen); // Devient /api/aanvragen/pending/count

// Route om alle aanvragen in afwachting op te halen
router.get('/pending', getAllPendingAanvragen); // Devient /api/aanvragen/pending

export default router;