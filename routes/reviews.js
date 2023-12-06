import express from "express";
import Review from "../models/reviews.js"
import {
    createReview,
    deleteReview,
    getAllReview,
    getReview, getReviewsByIds, getUserReviews,
    updateReview
} from "../controllers/reviews.js";
import {verifyUser} from "../utils/verifyToken.js";

const router= express.Router();


//CREATE
router.post("/",  createReview);

//UPDATE
router.put("/:id",  updateReview);

//DELETE
router.delete("/:id",verifyUser,deleteReview);


//GET
router.get("/:id", getReview);

//GET CAMPSITE REVIEWS
router.get("/campsite/:id", getUserReviews);

//GET REVIEWS BY ARRAY OF IDs
router.get('/reviewsByIds', getReviewsByIds);


//GET ALL
router.get("/", getAllReview);
export default router