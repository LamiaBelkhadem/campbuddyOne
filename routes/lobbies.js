import express from "express";
import { lobby } from "../controllers/lobby.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();
router.post("/", isAuthenticated, lobby.create);

router.put("/:id", isAuthenticated, lobby.update);
router.delete("/:id", isAuthenticated, lobby.remove);

router.get("/:id", isAuthenticated, lobby.get);
router.get("/", isAuthenticated, lobby.getAll);

export default router;
