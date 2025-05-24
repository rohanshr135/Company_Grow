import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
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
    skills: [String],
    experience: String,
    profileImage: String,

    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    assignedProjects: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    ],
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
