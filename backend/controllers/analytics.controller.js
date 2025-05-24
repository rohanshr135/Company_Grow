import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Project from "../models/project.model.js";
import Badge from "../models/Badge.model.js";
import Enrollment from "../models/enrollment.model.js";
import StripeRewardTransaction from "../models/stripeRewardTransaction.model.js";

export const orgAnalytics = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalCourses = await Course.countDocuments();
    const badgesAwarded = await Badge.countDocuments();
    const projectsActive = await Project.countDocuments({
      status: { $ne: "completed" },
    });

    const monthlyProjectCompletions = await StripeRewardTransaction.aggregate([
      {
        $group: {
          _id: { $month: "$completedAt" },
          value: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyCourseCompletions = await Enrollment.aggregate([
      { $match: { completedAt: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: { $month: "$completedAt" },
          value: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalRewards = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$badge" } } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyPerformance = monthlyProjectCompletions.map((mp) => ({
      month: monthNames[mp._id - 1],
      value: mp.value,
    }));
    const monthlyCoursePerf = monthlyCourseCompletions.map((mc) => ({
      month: monthNames[mc._id - 1],
      value: mc.value,
    }));

    res.json({
      totalEmployees,
      totalAdmins,
      totalCourses,
      badgesAwarded,
      projectsActive,
      totalRewards: totalRewards[0]?.total || 0,
      monthlyPerformance,
      monthlyCoursePerf,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

export const employeeAnalytics = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const userId =
      req.user.role === "admin" && req.query.userId
        ? req.query.userId
        : req.user._id;

    const user = await User.findById(userId)
      .populate("assignedProjects")
      .populate("completedProjects")
      .populate("enrolledCourses");

    if (!user) return res.status(404).json({ error: "User not found" });

    const projectCompletions = await StripeRewardTransaction.aggregate([
      {
        $match: {
          userId: user._id,
          status: "completed",
          completedAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$completedAt" },
          value: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const courseCompletions = await Enrollment.aggregate([
      {
        $match: {
          userId: user._id,
          completedAt: { $exists: true, $ne: null },
          ...(year && {
            completedAt: {
              $gte: new Date(`${year}-01-01T00:00:00Z`),
              $lte: new Date(`${year}-12-31T23:59:59Z`),
            },
          }),
        },
      },
      {
        $group: {
          _id: { $month: "$completedAt" },
          value: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyProjectPerf = monthNames.map((month, idx) => {
      const found = projectCompletions.find((m) => m._id === idx + 1);
      return { month, value: found ? found.value : 0 };
    });
    const monthlyCoursePerf = monthNames.map((month, idx) => {
      const found = courseCompletions.find((m) => m._id === idx + 1);
      return { month, value: found ? found.value : 0 };
    });

    res.json({
      name: user.name,
      totalRewards: user.badge || 0,
      assignedProjects: user.assignedProjects.length,
      completedProjects: user.completedProjects.length,
      enrolledCourses: user.enrolledCourses.length,
      monthlyProjectPerf,
      monthlyCoursePerf,
      availableYears: [
        ...new Set(
          [
            ...user.completedProjects.map((p) =>
              p?.createdAt ? new Date(p.createdAt).getFullYear() : null
            ),
            ...user.enrolledCourses.map((c) =>
              c?.createdAt ? new Date(c.createdAt).getFullYear() : null
            ),
            new Date().getFullYear(),
          ].filter(Boolean)
        ),
      ],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
