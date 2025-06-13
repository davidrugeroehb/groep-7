import express from "express";
import { loginAdmin } from "../controllers/adminAuthController.js";
import { getAdminProfile, updateAdminProfile } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", loginAdmin);

// Deze routes zijn correct als de frontend '/api/admin/mijnprofiel/EEN_ID' aanroept.
// Binnen deze router zijn de paden relatief aan het voorvoegsel dat in server.js wordt gebruikt.
router.get("/mijnprofiel/:adminId", getAdminProfile); // Wordt /api/admin/mijnprofiel/:adminId
router.put("/mijnprofiel/:adminId", updateAdminProfile); // Wordt /api/admin/mijnprofiel/:adminId

export default router;