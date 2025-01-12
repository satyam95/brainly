import { Router } from "express";
import {
  signinUser,
  signoutUser,
  signupUser,
} from "../controllers/user.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.route("/sign-up").post(asyncHandler(signupUser)); // http://localhost:8000/api/v1/user/sign-up
router.route("/sign-in").post(asyncHandler(signinUser)); // http://localhost:8000/api/v1/user/sign-in
router.route("/sign-out").get(asyncHandler(signoutUser)); // http://localhost:8000/api/v1/user/sign-out

export default router;
