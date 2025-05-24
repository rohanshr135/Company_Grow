import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { setProjectRating } from "../controllers/project.controller.js";
import {
  createProject,
  getProjects,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", protectRoute, isAdmin, createProject);

router.get("/", protectRoute, isAdmin, getProjects);
router.patch("/:id/rating", protectRoute, isAdmin, setProjectRating);

export default router;
