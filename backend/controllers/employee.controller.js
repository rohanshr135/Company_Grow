import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import asyncHandler from "express-async-handler";
import EnrollmentRequest from "../models/enrollmentRequest.model.js";

import ProjectCompletionRequest from "../models/projectCompletionRequest.model.js";

export const getEmployeeProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("assignedProjects")
    .populate("enrolledCourses")
    .populate("completedProjects");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

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

export const getMyBadge = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ badge: user.badge || 0 });
});

export const updateProjectProgress = asyncHandler(async (req, res) => {
  const { progress } = req.body;
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

export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ userId: req.user._id }).populate(
    "courseId"
  );
  res.json(enrollments);
});

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

export const requestEnrollment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.body;

  const existing = await EnrollmentRequest.findOne({
    userId,
    courseId,
    status: "pending",
  });
  if (existing) {
    return res
      .status(400)
      .json({ error: "You already have a pending request for this course." });
  }

  const request = await EnrollmentRequest.create({ userId, courseId });
  res.status(201).json({ message: "Enrollment request submitted.", request });
});

export const requestProjectCompletion = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { projectId, comment } = req.body;

  const existing = await ProjectCompletionRequest.findOne({
    userId,
    projectId,
    status: "pending",
  });
  if (existing) {
    return res
      .status(400)
      .json({ error: "You already have a pending request for this project." });
  }

  const request = await ProjectCompletionRequest.create({
    userId,
    projectId,
    comment,
  });
  res.status(201).json({ message: "Completion request submitted.", request });
});
export const getMyProjectCompletionRequests = asyncHandler(async (req, res) => {
  const requests = await ProjectCompletionRequest.find({
    userId: req.user._id,
  });
  res.json(requests);
});
