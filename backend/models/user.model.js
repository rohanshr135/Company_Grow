import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },
    skills: { type: [String], default: [] }, // Array of skills
    experience: { type: String, default: "" }, // e.g. "3 years"
    profileImage: {
      type: String,
      default: "https://example.com/avatar.jpg", // Default avatar
    },
    enrolledCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: [] },
    ],
    assignedProjects: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: [] },
    ],
    badge: { type: Number, default: 0 },
    projectCompletionPercent: {
      type: Object, // Use Object, not Map
      default: {},
    },
    completedProjects: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: [] },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
