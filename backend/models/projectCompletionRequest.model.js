import mongoose from "mongoose";

const projectCompletionRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    comment: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminComment: { type: String },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model(
  "ProjectCompletionRequest",
  projectCompletionRequestSchema
);
