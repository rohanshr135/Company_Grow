import {
  employeeAnalytics,
  orgAnalytics,
} from "../controllers/analytics.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { isAdmin } from "../middleware/isAdmin.js";
import express from "express";
const router = express.Router();

router.get("/org", protectRoute, isAdmin, orgAnalytics);
router.get("/employee", protectRoute, employeeAnalytics);

export default router;
