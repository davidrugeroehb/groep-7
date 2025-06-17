// backend/routes/speeddateDagRoutes.js
import express from 'express';
import {
  getSpeeddateDagSettings,
  updateSpeeddateDagSettings,
} from '../controllers/speeddateDagController.js';

const router = express.Router();

// Route om de globale speeddate dag instellingen op te halen
router.get('/', getSpeeddateDagSettings);

// Route om de globale speeddate dag instellingen bij te werken (of aan te maken)
router.put('/', updateSpeeddateDagSettings); // Gebruik PUT voor updates van een singleton resource

export default router;