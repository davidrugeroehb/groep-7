// backend/routes/lokaalRoutes.js
import express from 'express';
import {
  createLokaal,
  getAllLokalen,
  getLokaalById,
  updateLokaal,
  deleteLokaal,
} from '../controllers/lokaalController.js';

const router = express.Router();

// Route om een nieuw lokaal aan te maken
router.post('/', createLokaal);

// Route om alle lokalen op te halen
router.get('/', getAllLokalen);

// Route om een specifiek lokaal op ID op te halen
router.get('/:id', getLokaalById);

// Route om een lokaal bij te werken
router.put('/:id', updateLokaal);

// Route om een lokaal te verwijderen
router.delete('/:id', deleteLokaal);

export default router;