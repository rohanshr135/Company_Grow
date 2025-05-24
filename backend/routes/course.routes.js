import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

router
  .route("/")
  .post(protectRoute, isAdmin, createCourse)
  .get(protectRoute, getCourses);

router
  .route("/:id")
  .get(protectRoute, getCourseById)
  .put(protectRoute, isAdmin, updateCourse)
  .delete(protectRoute, isAdmin, deleteCourse);

export default router;
