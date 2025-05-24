// employee.controller.js
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Enrollment from "../models/enrollment.model.js";
import Badge from "../models/Badge.model.js";
import Course from "../models/course.model.js";
import asyncHandler from "express-async-handler";

// @desc    Get employee profile by ID
// @route   GET /api/users/:id
// @access  Authenticated
export const getEmployeeProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("assignedProjects")
    .populate("enrolledCourses")
    .populate("badges");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

// @desc    Update employee profile
// @route   PUT /api/users/:id
// @access  Employee/Admin
export const updateEmployeeProfile = asyncHandler(async (req, res) => {
  const { name, skills, experience, profileImage } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.skills = skills || user.skills;
  user.experience = experience || user.experience;
  user.profileImage = profileImage || user.profileImage;

  const updatedUser = await user.save();
  res.json(updatedUser);
});

// @desc    Get badges of logged-in employee
// @route   GET /api/badges
// @access  Employee
export const getMyBadges = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("badges");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.badges);
});

// @desc    Update project progress by employee
// @route   PATCH /api/projects/:id/progress
// @access  Employee
export const updateProjectProgress = asyncHandler(async (req, res) => {
  const { progress } = req.body; // { milestone: progressValue }
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!project.assignedTo.includes(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to update this project");
  }

  project.progress.set(req.user._id.toString(), progress);
  await project.save();

  res.json({ message: "Progress updated", progress });
});

// @desc    Get enrollments for logged-in user
// @route   GET /api/enrollments
// @access  Employee
export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ userId: req.user._id }).populate(
    "courseId"
  );
  res.json(enrollments);
});

// @desc    Update course progress
// @route   PATCH /api/enrollments/:id/progress
// @access  Employee
export const updateCourseProgress = asyncHandler(async (req, res) => {
  const { progress, completedMilestones } = req.body;
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment || enrollment.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized or enrollment not found");
  }

  enrollment.progress = progress;
  enrollment.completedMilestones = completedMilestones;
  if (progress === 100) enrollment.completedAt = new Date();

  await enrollment.save();
  res.json({ message: "Progress updated", enrollment });
});
