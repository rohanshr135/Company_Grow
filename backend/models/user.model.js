import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    enrolledCourses: [
      {
        type: Types.ObjectId,
        ref: "Course",
      },
    ],
    assignedProjects: [
      {
        type: Types.ObjectId,
        ref: "Project",
      },
    ],
    badges: [
      {
        type: Types.ObjectId,
        ref: "Badge",
      },
    ],
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
