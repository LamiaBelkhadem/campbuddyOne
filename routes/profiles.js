import express from "express";
import {createProfile, deleteProfile, getAllProfile, getProfile, updateProfile} from "../controllers/profile.js";
import {verifyAdmin,verifyUser} from "../utils/verifyToken.js";
const router=express.Router();

//CREATE
router.post("/:userId", createProfile)

//UPDATE
router.put("/:id", verifyUser, updateProfile);

//DELETE
router.delete("/:id/:userId", verifyAdmin, deleteProfile);

//GET
router.get("/:id",verifyUser, getProfile);

//GET ALL
router.get("/", verifyUser, getAllProfile);
export default router