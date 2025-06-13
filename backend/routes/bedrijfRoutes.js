import express from "express";
import { registerBedrijf } from "../controllers/bedrijfAuthController.js";
import {
  createSpeeddate,
  getCompanySpeeddates,
  getCompanyProfile,
  updateCompanyProfile,
  countAllBedrijven,
  getAllBedrijven,
  getAllPendingBedrijfRegistrations,
  countPendingBedrijfRegistrations,
  approveBedrijfRegistration,
  rejectBedrijfRegistration,
} from '../controllers/bedrijfController.js';

const router = express.Router();

// Registratie van bedrijven
router.post("/register", registerBedrijf); // <-- Zorg dat deze route '/register' is, NIET '/bedrijf/register'

// Speeddate gerelateerde routes
router.post("/speeddates", createSpeeddate);
router.get("/speeddates/:bedrijfId", getCompanySpeeddates);

// Bedrijfs Profiel gerelateerde routes
router.get('/profiel/:bedrijfId', getCompanyProfile);
router.put('/profiel/:bedrijfId', updateCompanyProfile);

// Routes voor het tellen van bedrijven (voor dashboard)
router.get('/count', countAllBedrijven);

// NIEUWE ROUTES VOOR BEDRIJFSREGISTRATIEBEHEER (voor admin)
router.get('/', getAllBedrijven); // Haal alle goedgekeurde bedrijven op
router.get('/pending-registrations', getAllPendingBedrijfRegistrations); // Haal alle afwachtende registraties op
router.get('/pending-registrations/count', countPendingBedrijfRegistrations); // Tel het aantal afwachtende registraties

router.patch('/approve-registration/:bedrijfId', approveBedrijfRegistration); // Keur een bedrijfsregistratie goed
router.patch('/reject-registration/:bedrijfId', rejectBedrijfRegistration); // Keur een bedrijfsregistratie af

export default router;