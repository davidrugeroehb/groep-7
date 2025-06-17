import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/adminAuthController.js"; // Importeer nu ook registerAdmin
import { getAdminProfile, updateAdminProfile } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", loginAdmin);

// NIEUWE ROUTE: Registreer een nieuwe admin
// Wordt: /api/admin/register
router.post("/register", registerAdmin);

// Routes voor admin profielbeheer
// Worden: /api/admin/mijnprofiel/:adminId
router.get("/mijnprofiel/:adminId", getAdminProfile);
router.put("/mijnprofiel/:adminId", updateAdminProfile);

export default router;