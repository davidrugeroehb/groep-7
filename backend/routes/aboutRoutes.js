import express from 'express';
import { getabout, updateabout } from '../controllers/aboutController.js'; // Zorg dat de functies correct zijn geïmporteerd

const router = express.Router();

// Route voor het ophalen van de "About" tekst
router.get("/", getabout);

// Route voor het bijwerken van de "About" tekst
router.put("/", updateabout);

export default router;