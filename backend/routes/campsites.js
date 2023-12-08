import express from "express";
const router= express.Router();
import {
    createCampsite,
    updateCampsite,
    deleteCampsite,
    getAllCampsite,
    getCampsite,
    addReview
} from "../controllers/campsite.js";
import {verifyAdmin, verifyUser} from "../utils/verifyToken.js";



//CREATE
router.post("/", verifyAdmin, createCampsite);

//UPDATE
router.put("/:id",  updateCampsite);

//ADD REVIEW
router.put("/addReview/:id", addReview);

//DELETE
router.delete("/:id",verifyAdmin,deleteCampsite);


//GET
router.get("/:id", getCampsite);


//GET ALL
router.get("/", getAllCampsite);
export default router
