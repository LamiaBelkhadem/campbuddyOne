import express from "express";
import { review } from "../controllers/reviews.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

//CREATE
router.post("/", review.create);

//UPDATE
router.put("/:id", review.update);

//DELETE
router.delete("/:id", review.remove);

//GET
router.get("/:id", review.getOne);

router.get("/review/campsite/:id", review.viewUserReview);
router.get("/reviews/id", review.getByIds);
router.get("/", review.getAll);

export default router;
