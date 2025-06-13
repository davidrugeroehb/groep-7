import express from "express";
import { registerBedrijf } from "../controllers/bedrijfAuthController.js";
import {
  createSpeeddate,
  getCompanySpeeddates,
  getCompanyProfile,
  updateCompanyProfile,
  countAllBedrijven // Nieuwe functie importeren
} from '../controllers/bedrijfController.js';

const router = express.Router();

router.post("/register", registerBedrijf);

router.post("/speeddates", createSpeeddate);
router.get("/speeddates/:bedrijfId", getCompanySpeeddates);

// Route om het aantal bedrijven te tellen
router.get('/count', countAllBedrijven);

router.get('/profiel/:bedrijfId', getCompanyProfile);

// Route om de profiel van een bedrijf up te daten
router.put('/profiel/:bedrijfId', updateCompanyProfile);

export default router;