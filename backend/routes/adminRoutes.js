import express from "express";
import { loginAdmin } from "../controllers/adminAuthController.js"; // Pas deze import aan naar de correcte export van je adminAuthController.js
import { getAdminProfile } from "../controllers/adminController.js"; // Importeer de nieuwe functie
// Importeer hier je authenticatie middleware als je die hebt (bijv. verifyToken, isAdmin)
// import { verifyToken, isAdmin } from '../middleware/authMiddleware.js'; // Voorbeeld


const router = express.Router();

router.post("/login", loginAdmin); // Login route

// Route voor admin profiel. Bescherm deze route!
// Als u een authenticatie middleware heeft, voeg die hier toe:
// router.get("/mijnprofiel/:adminId", verifyToken, isAdmin, getAdminProfile); // Voorbeeld met middleware
router.get("/mijnprofiel/:adminId", getAdminProfile); // TIJDELIJK: Zonder middleware, als je die nog niet hebt. Let op de veiligheid!

export default router;