import express from 'express';
import { loginUser } from '../controllers/authController.js'; // Import the new unified login controller

const router = express.Router();

// Unified login route
router.post('/login', loginUser);

export default router;
