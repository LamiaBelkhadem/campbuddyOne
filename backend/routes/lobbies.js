import express from "express";
import Lobby from "../models/lobbies.js"
import {createLobby, deleteLobby, getAllLobby, getLobby, updateLobby} from "../controllers/lobby.js";
import {verifyUser} from "../utils/verifyToken.js";

const router= express.Router();


//CREATE
router.post("/",  createLobby);

//UPDATE
router.put("/:id", verifyUser, updateLobby);

//DELETE
router.delete("/:id",verifyUser,deleteLobby);


//GET
router.get("/:id", getLobby);


//GET ALL
router.get("/", getAllLobby);
export default router