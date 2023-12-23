import { recommandation } from "../controllers/recommandations.js";
import { Router } from "express"

const router = Router()

router.get("/", recommandation.search);
router.get("/lobby", recommandation.lobby);
router.get("/campsite", recommandation.campsite);


export default router;

