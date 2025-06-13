import express from "express";
import { registerBedrijf } from "../controllers/bedrijfAuthController.js";
import {
  createSpeeddate,
  getCompanySpeeddates,
  getCompanyProfile,
  updateCompanyProfile,
  countAllBedrijven, // Importeer deze indien nodig (voor dashboard)
  getAllBedrijven // Importeer de nieuwe functie
} from '../controllers/bedrijfController.js';

const router = express.Router();

router.post("/register", registerBedrijf);

router.post("/speeddates", createSpeeddate);
router.get("/speeddates/:bedrijfId", getCompanySpeeddates);

// Route om het aantal bedrijven te tellen (voor dashboard, deze is al correct)
router.get('/count', countAllBedrijven);

// Route om de profiel van een bedrijf op te halen (bestaat al)
router.get('/profiel/:bedrijfId', getCompanyProfile);

// Route om de profiel van een bedrijf up te daten (bestaat al)
router.put('/profiel/:bedrijfId', updateCompanyProfile);

// NIEUWE ROUTE: Haal alle bedrijven op
router.get('/', getAllBedrijven); // Dit zal overeenkomen met /api/bedrijven op je server.js

export default router;