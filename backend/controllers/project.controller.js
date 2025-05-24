import Project from "../models/project.model.js";
import asyncHandler from "express-async-handler";

export const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requiredSkills = [],
    assignedTo = [],
    milestones = [],
    startDate,
    endDate,
    status,
  } = req.body;

  const project = await Project.create({
    title,
    description,
    requiredSkills,
    assignedTo,
    milestones,
    startDate,
    endDate,
    status,
    createdBy: req.user._id,
  });

  res.status(201).json(project);
});
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().populate("assignedTo", "name email");
  res.json(projects);
});
export const setProjectRating = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  if (typeof rating !== "number" || rating < 1 || rating > 10) {
    return res
      .status(400)
      .json({ error: "Rating must be a number between 1 and 10" });
  }
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { rating },
    { new: true }
  );
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.json(project);
});
