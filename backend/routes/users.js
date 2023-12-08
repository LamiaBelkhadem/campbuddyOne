import express from "express";
import {addFavorite, deleteUser, getAllUser, getUser, removeFavorite, updateUser} from "../controllers/user.js";
import {verifyAdmin, verifyToken, verifyUser} from "../utils/verifyToken.js";
const router= express.Router();


router.get("/checkauthentication",verifyToken,(req,res,next)=>{
    res.send("Hello user, you are logged in");
})

router.get("/checkuser/",verifyUser,(req,res,next)=>{
    res.send("Hello user, you are authenticated and can delete your account");
})

router.get("/checkadmin/:id",verifyAdmin,(req,res,next)=>{
    res.send("Hello admin, you are authenticated and can delete your account");
})

//UPDATE
router.put("/:id", updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);


//GET
router.get("/", getUser);

//ADD FAVORITES
router.put("/addFavourites/:id", addFavorite);

//REMOVE FAVORITES
router.put("/removeFavourites/:id", removeFavorite);


//GET ALL
router.get("/", getAllUser);
export default router