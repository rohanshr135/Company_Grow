import express from "express";
import {
  signup,
  logout,
  login,
  getMe,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();
//signup route
router.post("/signup", signup);
// login route
router.post("/login", login);

// logout route
router.post("/logout", logout);

router.get("/me", protectRoute, getMe);

export default router;
