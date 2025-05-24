import Course from "../models/course.model.js";
import asyncHandler from "express-async-handler";

export const createCourse = asyncHandler(async (req, res) => {
  if (!req.user) {
    console.error("No user found in request");
    return res.status(401).json({ error: "Not authorized" });
  }
  const {
    title,
    description,
    level,
    duration,
    media = "",
    milestones = [],
  } = req.body;
  try {
    const course = await Course.create({
      title,
      description,
      level,
      duration,
      media,
      milestones,
      createdBy: req.user._id,
    });
    res.status(201).json(course);
  } catch (err) {
    console.error("Error creating course:", err);
    res
      .status(500)
      .json({ error: "Failed to create course", details: err.message });
  }
});

export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.json(course);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.json(course);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.json({ message: "Course deleted" });
});
