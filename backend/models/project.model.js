import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    requiredSkills: [String],
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    milestones: [String],
    progress: {
      type: Map,
      of: Number, // userId => progress %
    },
    startDate: Date,
    endDate: Date,
    projectCompletionPercent: {
      type: Map,
      of: Number, // projectId => percent (0-100)
      default: {},
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 10, default: null },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
