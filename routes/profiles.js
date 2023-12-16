import express from "express";
import path from "node:path";
import {profile} from "../controllers/profile.js";
import {isAdmin} from "../middlewares/isAdmin.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/images/users/${req.user.id}`);
    },
    filename: (req, file, cb) => {
        cb(null, "profile-pic.png");
    },
});

const upload = multer({storage});

router.post("/", upload.single("file"), profile.upsertProfile);
router.get("/my-profile",profile.myProfile)
router.delete("/:id/:userId", isAdmin, profile.remove);
router.get("/:id", profile.getOne);
router.get("/", isAdmin, profile.getAll);

export default router;
