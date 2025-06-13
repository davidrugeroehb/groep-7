import express from 'express';
import { countAllSpeeddates } from '../controllers/speeddateController.js'; // Nieuwe functie importeren

const router = express.Router();

// Route om de totale aantal speeddates te tellen
router.get('/count', countAllSpeeddates);

export default router;