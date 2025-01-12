import { Router } from "express";
import {
  addContent,
  getContent,
//   updateContent,
//   deleteContent,
} from "../controllers/content.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.route("/").get(isAuthenticated, getContent); // http://localhost:8000/api/v1/content
router.route("/").post(isAuthenticated, addContent); // http://localhost:8000/api/v1/content
// router.route("/:id").put(updateContent); // http://localhost:8000/api/v1/content/:id
// router.route("/:id").delete(deleteContent); // http://localhost:8000/api/v1/content/:id

export default router;
