import express from "express";
import { registerBedrijf, loginBedrijf } from "../controllers/bedrijfAuthController.js";

const router = express.Router();

router.post("/register", registerBedrijf);
router.post("/login", loginBedrijf);

export default router;

