import express from "express";
import {
  getEmployeeProfile,
  updateEmployeeProfile,
  getMyBadge,
  getMyEnrollments,
  updateCourseProgress,
  updateProjectProgress,
  requestEnrollment,
  requestProjectCompletion,
  getMyProjectCompletionRequests,
} from "../controllers/employee.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router
  .route("/profile")
  .get(protectRoute, getEmployeeProfile)
  .put(protectRoute, updateEmployeeProfile);

router.route("/badges").get(protectRoute, getMyBadge);
router.route("/enrollments").get(protectRoute, getMyEnrollments);
router
  .route("/enrollments/:id/progress")
  .patch(protectRoute, updateCourseProgress);
router
  .route("/projects/:id/progress")
  .patch(protectRoute, updateProjectProgress);

router.post("/enrollments", protectRoute, requestEnrollment);
router.post(
  "/projects/completion-request",
  protectRoute,
  requestProjectCompletion
);
router.get(
  "/project-completion-requests",
  protectRoute,
  getMyProjectCompletionRequests
);

export default router;
