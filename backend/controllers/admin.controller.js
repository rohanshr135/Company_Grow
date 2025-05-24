// admin.controller.js
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import Badge from "../models/Badge.model.js";

// @desc    Get all users (employees)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "employee" }).select("-password");
  res.json(users);
});

// @desc    Assign project to user
// @route   POST /api/admin/users/:id/assign-project
// @access  Admin
export const assignProjectToUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { projectId } = req.body;

  const user = await User.findById(userId);
  const project = await Project.findById(projectId);

  if (!user || !project) {
    res.status(404);
    throw new Error("User or Project not found");
  }

  if (!user.assignedProjects.includes(projectId)) {
    user.assignedProjects.push(projectId);
    project.assignedTo.push(userId);
    await user.save();
    await project.save();
  }

  res.json({ message: "Project assigned successfully" });
});

// @desc    Enroll user to course
// @route   POST /api/admin/users/:id/enroll-course
// @access  Admin
export const enrollUserToCourse = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { courseId } = req.body;

  const user = await User.findById(userId);
  const course = await Course.findById(courseId);

  if (!user || !course) {
    res.status(404);
    throw new Error("User or Course not found");
  }

  const alreadyEnrolled = await Enrollment.findOne({ userId, courseId });
  if (alreadyEnrolled) {
    res.status(400);
    throw new Error("User is already enrolled in this course");
  }

  const enrollment = new Enrollment({ userId, courseId });
  await enrollment.save();
  res.json({ message: "User enrolled to course successfully", enrollment });
});

// @desc    Award badge to user
// @route   POST /api/admin/users/:id/award-badge
// @access  Admin
export const awardBadgeToUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { badgeId } = req.body;

  const user = await User.findById(userId);
  const badge = await Badge.findById(badgeId);

  if (!user || !badge) {
    res.status(404);
    throw new Error("User or Badge not found");
  }

  if (!user.badges.includes(badgeId)) {
    user.badges.push(badgeId);
    await user.save();
  }

  res.json({ message: "Badge awarded successfully" });
});

export const promoteToAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if the user is already an admin
  if (user.role === "admin") {
    res.status(400);
    throw new Error("User is already an admin");
  }

  // Promote the user to admin
  user.role = "admin";
  await user.save();

  res.json({ message: "User promoted to admin successfully", user });
});
