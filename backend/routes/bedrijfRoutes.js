import express from "express";
// Only import registerBedrijf, as login is now handled by authController.js
import { registerBedrijf } from "../controllers/bedrijfAuthController.js";
import { createSpeeddate, getCompanySpeeddates } from '../controllers/bedrijfController.js';

const router = express.Router();

router.post("/register", registerBedrijf); // Keep registration route

// REMOVED: router.post("/login", loginBedrijf); // This login is now handled by /api/auth/login

// Route to create a new speeddate
router.post("/speeddates", createSpeeddate);

// Route to get speeddates for a specific company
router.get("/speeddates/:bedrijfId", getCompanySpeeddates);

export default router;
