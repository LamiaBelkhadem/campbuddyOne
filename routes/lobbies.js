import express from "express";
import { lobby } from "../controllers/lobby.js";

const router = express.Router();
router.post("/", lobby.create);
router.put("/:id", lobby.update);
router.delete("/:id", lobby.remove);
router.get("/:id", lobby.get);
router.get("/", lobby.getAll);

export default router;
