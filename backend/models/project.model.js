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
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
