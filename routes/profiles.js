import express from "express";
import { profile } from "../controllers/profile.js";
import { isAdmin } from "../middlewares/isAdmin.js";
const router = express.Router();

//CREATE
router.post("/:userId", profile.create);

router.put("/:id", profile.update);

//DELETE
router.delete("/:id/:userId", isAdmin, profile.remove);

//GET
router.get("/:id",  profile.getOne);

//GET ALL
router.get("/", isAdmin, profile.getAll);

export default router;
