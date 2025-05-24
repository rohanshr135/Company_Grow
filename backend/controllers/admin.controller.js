import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import Badge from "../models/Badge.model.js";
import EnrollmentRequest from "../models/enrollmentRequest.model.js";
import ProjectCompletionRequest from "../models/projectCompletionRequest.model.js";
import StripeRewardTransaction, {
  calculateStripeRewardUSD,
} from "../models/stripeRewardTransaction.model.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

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
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    res.status(400);
    throw new Error("User is already an admin");
  }

  user.role = "admin";
  await user.save();

  res.json({ message: "User promoted to admin successfully", user });
});

export const getEnrollmentRequests = asyncHandler(async (req, res) => {
  const requests = await EnrollmentRequest.find({ status: "pending" })
    .populate("userId", "name email")
    .populate("courseId", "title");
  res.json(requests);
});

export const approveEnrollmentRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const request = await EnrollmentRequest.findById(requestId);
  if (!request || request.status !== "pending") {
    return res
      .status(404)
      .json({ error: "Request not found or already processed." });
  }

  const alreadyEnrolled = await Enrollment.findOne({
    userId: request.userId,
    courseId: request.courseId,
  });
  if (!alreadyEnrolled) {
    await Enrollment.create({
      userId: request.userId,
      courseId: request.courseId,
    });

    await User.findByIdAndUpdate(request.userId, {
      $addToSet: { enrolledCourses: request.courseId },
    });
  }

  request.status = "approved";
  request.reviewedAt = new Date();
  await request.save();

  res.json({ message: "Enrollment approved and user enrolled." });
});

export const rejectEnrollmentRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const request = await EnrollmentRequest.findById(requestId);
  if (!request || request.status !== "pending") {
    return res
      .status(404)
      .json({ error: "Request not found or already processed." });
  }
  request.status = "rejected";
  request.reviewedAt = new Date();
  await request.save();
  res.json({ message: "Enrollment request rejected." });
});

export const getProjectCompletionRequests = asyncHandler(async (req, res) => {
  const requests = await ProjectCompletionRequest.find({ status: "pending" })
    .populate("userId", "name email")
    .populate("projectId", "title");
  res.json(requests);
});
export const rejectProjectCompletion = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { adminComment } = req.body;
  const request = await ProjectCompletionRequest.findById(requestId);
  if (!request || request.status !== "pending") {
    return res
      .status(404)
      .json({ error: "Request not found or already processed." });
  }
  request.status = "rejected";
  request.adminComment = adminComment;
  request.reviewedAt = new Date();
  await request.save();
  res.json({ message: "Project completion request rejected." });
});

export const approveProjectCompletion = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { percent = 100 } = req.body;

  const request = await ProjectCompletionRequest.findById(requestId).populate(
    "projectId"
  );
  if (!request || request.status !== "pending") {
    return res
      .status(404)
      .json({ error: "Request not found or already processed." });
  }

  const user = await User.findById(request.userId);
  const project = request.projectId;

  if (user && project) {
    user.projectStatus = user.projectStatus || {};
    user.projectStatus[project._id] = "completed";
    user.projectCompletionPercent = user.projectCompletionPercent || {};
    user.projectCompletionPercent[project._id.toString()] = percent;
    if (percent === 100) {
      user.assignedProjects = (user.assignedProjects || []).filter(
        (pid) => pid.toString() !== project._id.toString()
      );
      user.completedProjects = user.completedProjects || [];
      if (
        !user.completedProjects.some(
          (pid) => pid.toString() === project._id.toString()
        )
      ) {
        user.completedProjects.push(project._id);
      }
    }

    const assignedAt = project.startDate || new Date();
    const completedAt = new Date();
    const hoursTaken = Math.max(
      4,
      (completedAt - assignedAt) / (1000 * 60 * 60)
    );
    const rewardUSD = calculateStripeRewardUSD({
      rating: project.rating || 10,
      hoursTaken,
      type: "project",
    });

    await StripeRewardTransaction.create({
      userId: user._id,
      tokensUsed: Math.round(rewardUSD * 10),
      amountUSD: rewardUSD,
      stripeSessionId: "reward",
      status: "completed",
      completedAt,
    });

    user.badge = (user.badge || 0) + rewardUSD;
    await user.save();
  }

  request.status = "approved";
  request.reviewedAt = new Date();
  await request.save();

  res.json({
    message: "Project marked as completed for employee and reward granted.",
  });
});
