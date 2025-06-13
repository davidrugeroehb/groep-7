import express from 'express';
import {
  createSpeeddate,
  getAllSpeeddates,
  getCompanySpeeddates,
  deleteSpeeddate,
  countAllSpeeddates // Import for admin
} from '../controllers/speeddateController.js';

const router = express.Router();

// Public routes for speeddates
router.get('/', getAllSpeeddates); // Get all speeddates (for students)
router.get('/count', countAllSpeeddates); // For admin dashboard

// Company specific routes for speeddates
router.post('/', createSpeeddate); // Create a new speeddate
router.get('/bedrijf/:bedrijfId', getCompanySpeeddates); // Get speeddates by company ID
router.delete('/:speeddateId', deleteSpeeddate); // Delete a speeddate by ID


export default router;