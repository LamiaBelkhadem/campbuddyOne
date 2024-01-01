import express from "express";
import { v4 as uuidv4 } from "uuid";
import { campsite } from "../controllers/campsite.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import multer from "multer";

const router = express.Router();
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images/tmp/campsites");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${uuidv4()}}.png`);
	},
});

const upload = multer({ storage });

router.post("/upload", isAdmin, upload.single("file"), campsite.upload);
router.post("/", isAdmin, campsite.create);
router.put("/:id", isAdmin, campsite.update);
router.delete("/:id", isAdmin, campsite.remove);
router.delete("/favourites/:id", campsite.deleteFromFavorite);
router.put("/favourites/:id", campsite.addToFavorite);
router.post('/campsites/multiple', campsite.getMultiple);
router.get("/", campsite.getAll);
router.get("/:id", campsite.getOne);
router.get("/:id/reviews", campsite.getReviewsForCampsite);
router.put("/:id/reviews", campsite.addReview);
router.get("/reviews", campsite.allCampsitesWithReviews);

export default router;
