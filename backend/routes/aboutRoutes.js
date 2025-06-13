import express from 'express';
import { getabout, updateabout } from '../controllers/aboutController.js';

const router = express.Router();

router.get("/", getabout);
router.put("/", updateabout);

export default router;