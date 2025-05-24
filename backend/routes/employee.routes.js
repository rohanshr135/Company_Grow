import express from "express";
import {
  getEmployeeProfile,
  updateEmployeeProfile,
  getMyBadges,
  getMyEnrollments,
  updateCourseProgress,
  updateProjectProgress,
} from "../controllers/employee.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router
  .route("/profile")
  .get(protectRoute, getEmployeeProfile)
  .put(protectRoute, updateEmployeeProfile);

router.route("/badges").get(protectRoute, getMyBadges);
router.route("/enrollments").get(protectRoute, getMyEnrollments);
router
  .route("/enrollments/:id/progress")
  .patch(protectRoute, updateCourseProgress);
router
  .route("/projects/:id/progress")
  .patch(protectRoute, updateProjectProgress);

export default router;
