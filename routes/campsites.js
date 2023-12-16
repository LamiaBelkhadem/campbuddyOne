import express from "express";
import { campsite } from "../controllers/campsite.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

//CREATE
router.post("/", isAdmin, campsite.create);

//UPDATE
router.put("/:id", isAdmin, campsite.update);

//ADD REVIEW
router.put("/review/:id", campsite.addReview);

router.delete("/:id", isAdmin, campsite.remove);

router.get("/:id", campsite.getOne);
router.get("/", campsite.getAll);

export default router;
