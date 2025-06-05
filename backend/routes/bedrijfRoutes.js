import express from "express";
import { loginBedrijf, registerBedrijf } from "../controllers/bedrijfAuthController.js";

const router = express.Router();

router.post("/login", loginBedrijf);
router.post("/register", registerBedrijf);

export default router;
