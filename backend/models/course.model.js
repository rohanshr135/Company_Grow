import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: { type: Number, required: true }, // in hours
    media: {
      videoURL: { type: String },
      imageURL: { type: String },
    },
    milestones: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
