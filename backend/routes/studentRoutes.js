import express from "express";
// Only import getAllSpeeddates, as login is now handled by authController.js
import { getAllSpeeddates } from '../controllers/studentController.js';

const router = express.Router();

// REMOVED: router.post("/login", loginStudent); // This login is now handled by /api/auth/login

// Route to get all speeddates (for students)
router.get('/speeddates', getAllSpeeddates);

export default router;
