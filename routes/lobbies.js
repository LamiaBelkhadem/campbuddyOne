import express from "express";
import { lobby } from "../controllers/lobby.js";

const router = express.Router();

router.post("/", lobby.create);
router.put("/:id", lobby.update);
router.delete("/:id", lobby.remove);
router.get('/byOwner/:ownerId', lobby.getLobbiesByOwner);
router.get('/byParticipant/:participantId', lobby.getLobbiesByParticipant);
router.get("/:id", lobby.get);
router.get("/", lobby.getAll);
router.post("/:id/join", lobby.joinLobby);
router.delete("/:id/leave", lobby.leaveLobby);

export default router;
