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
router.post('/', createAanvraag);
router.get('/student/:studentId', getStudentAanvragen); 
router.delete('/:aanvraagId', deleteAanvraag); 
router.get('/afspraken/student/:studentId', getStudentAfspraken); 

// Routes voor bedrijven
router.get('/bedrijf/:bedrijfId', getBedrijfAanvragen); 
router.patch('/:aanvraagId', updateAanvraagStatus); 

// NIEUWE ROUTES VOOR ADMIN (CORRIGÉES)
// Route voor aantal aanvragen in afwachting
router.get('/pending/count', countPendingAanvragen); 

// Route om alle aanvragen in afwachting op te halen
router.get('/pending', getAllPendingAanvragen); 

export default router;