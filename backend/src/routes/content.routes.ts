import { Router } from "express";
import {
  addContent,
  deleteContent,
  getContent,
  getContentByType,
  getSingleContent,
  searchContent,
  updateContent,
} from "../controllers/content.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router();

router.route("/search").get(isAuthenticated, searchContent); // http://localhost:8000/api/v1/content/search?query=example
router.route("/").get(isAuthenticated, getContent); // http://localhost:8000/api/v1/content
router.route("/").post(isAuthenticated, addContent); // http://localhost:8000/api/v1/content
router.route("/type/:type").get(isAuthenticated, getContentByType); // http://localhost:8000/api/v1/content/type/:type
router.route("/:id").get(isAuthenticated, getSingleContent); // http://localhost:8000/api/v1/content/:id
router.route("/:id").delete(isAuthenticated, deleteContent); // http://localhost:8000/api/v1/content/:id
router.route("/:id").put(isAuthenticated, updateContent); // http://localhost:8000/api/v1/content/:id


export default router;
