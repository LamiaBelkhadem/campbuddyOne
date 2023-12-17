import express from "express";
import multer from "multer";
import { user } from "../controllers/user.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/check-authentication", isAuthenticated, (req, res, next) => {
	res.send("Hello profile, you are logged in");
});

router.get("/check-user/", isAuthenticated, (req, res, next) => {
	res.send(
		"Hello profile, you are authenticated and can delete your account"
	);
});

router.get("/check-admin/:id", isAdmin, (req, res, next) => {
	res.send("Hello admin, you are authenticated and can delete your account");
});

// TODO delete my own account
// router.delete("/", isUser, deleteAccount);

router.delete("/:id", isAdmin, user.remove);
router.get("/", isAdmin, user.getOne);
router.post("/favorites", user.addFavorite);
router.delete("/favorites/:id", user.remove);
router.get("/", isAdmin, user.getAll);

export default router;
