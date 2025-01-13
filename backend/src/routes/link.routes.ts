import { Router } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { getShareLink, shareBrain } from "../controllers/brain.controller";

const router = Router();

router.route("/share").post(isAuthenticated, shareBrain); // http://localhost:8000/api/v1/brain/share
router.route("/:shareLink").get(getShareLink); // http://localhost:8000/api/v1/brain/:shareLink

export default router;
