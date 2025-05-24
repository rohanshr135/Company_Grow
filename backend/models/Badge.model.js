import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    iconURL: String,
    tokenValue: { type: Number, default: 0 }, // tokens earned
    criteria: String, // auto or manual award conditions
    awardedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    awardedOn: [Date],
  },
  { timestamps: true }
);

const Badge = mongoose.model("Badge", badgeSchema);
export default Badge;
