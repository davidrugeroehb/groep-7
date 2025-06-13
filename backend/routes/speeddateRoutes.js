import express from 'express';
import {
  countAllSpeeddates
} from '../controllers/speeddateController.js'; // Importeer de nieuwe functie
import {
  getAllSpeeddates
} from '../controllers/studentController.js'; // Importeer getAllSpeeddates van studentController


const router = express.Router();

// Route voor het tellen van speeddates (voor dashboard)
router.get('/count', countAllSpeeddates);

// NIEUWE/VERPLAATSTE ROUTE: Haal alle speeddates op voor de admin
router.get('/', getAllSpeeddates); // Dit zal corresponderen met /api/speeddates op je server.js

export default router;