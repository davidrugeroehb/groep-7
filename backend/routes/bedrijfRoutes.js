import express from "express";
import { registerBedrijf } from "../controllers/bedrijfAuthController.js";
import { createSpeeddate, getCompanySpeeddates, getCompanyProfile, updateCompanyProfile } from '../controllers/bedrijfController.js'; // Importeer de nieuwe functies

const router = express.Router();

router.post("/register", registerBedrijf); // Bestaande registratie route

router.post("/speeddates", createSpeeddate); // Bestaande speeddate aanmaak route
router.get("/speeddates/:bedrijfId", getCompanySpeeddates); // Bestaande route voor bedrijf-specifieke speeddates

// NIEUWE ROUTE: Profiel van een specifiek bedrijf ophalen
router.get('/profiel/:bedrijfId', getCompanyProfile);

// NIEUWE ROUTE: Profiel van een specifiek bedrijf bijwerken
router.put('/profiel/:bedrijfId', updateCompanyProfile);

export default router;
