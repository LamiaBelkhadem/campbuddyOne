import express from "express";
import {auth} from "../controllers/auth.js";
import {isAuthenticated} from "../middlewares/index.js";

const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/verify/:token", auth.verifyEmail);
router.get("/me", isAuthenticated, auth.me);

export default router;