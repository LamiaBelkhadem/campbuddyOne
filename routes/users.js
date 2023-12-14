import express from "express";
import { user } from "../controllers/user.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.get("/checkauthentication", isAuthenticated, (req, res, next) => {
  res.send("Hello user, you are logged in");
});

router.get("/checkuser/", isAuthenticated, (req, res, next) => {
  res.send("Hello user, you are authenticated and can delete your account");
});

router.get("/checkadmin/:id", isAdmin, (req, res, next) => {
  res.send("Hello admin, you are authenticated and can delete your account");
});

router.put("/:id", user.update);

// TODO delete my own account
// router.delete("/", isUser, deleteAccount);

router.delete("/:", isAdmin, user.remove);
router.get("/", isAdmin, user.getOne);

router.post("/favorites", user.addFavorite);
router.delete("/favorites/:id", user.remove);
router.get("/", isAdmin, user.getAll);

export default router;
