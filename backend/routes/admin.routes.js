// admin.routes.js
import express from "express";
import {
  getAllUsers,
  assignProjectToUser,
  enrollUserToCourse,
  awardBadgeToUser,
  promoteToAdmin,
} from "../controllers/admin.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { isAdmin } from "../middleware/isAdmin.js"; // custom middleware for admin check

const router = express.Router();

router.route("/users").get(protectRoute, isAdmin, getAllUsers);
router
  .route("/users/:id/assign-project")
  .post(protectRoute, isAdmin, assignProjectToUser);
router
  .route("/users/:id/enroll-course")
  .post(protectRoute, isAdmin, enrollUserToCourse);
router
  .route("/users/:id/award-badge")
  .post(protectRoute, isAdmin, awardBadgeToUser);

router
  .route("/users/:id/promote-to-admin")
  .patch(protectRoute, isAdmin, promoteToAdmin);

export default router;
