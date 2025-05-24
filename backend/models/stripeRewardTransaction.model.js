import mongoose from "mongoose";

const stripeRewardTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tokensUsed: { type: Number, required: true },
    amountUSD: { type: Number, required: true },
    stripeSessionId: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

const StripeRewardTransaction = mongoose.model(
  "StripeRewardTransaction",
  stripeRewardTransactionSchema
);

export default StripeRewardTransaction;

/**
 * Calculate Stripe reward in USD for a completed project or course.
 * - Completing a hard (rating 10) project in 4 hours gives $10.
 * - Reward decreases for lower ratings and longer durations.
 * - Projects are weighted more than courses.
 * @param {Object} params
 * @param {number} params.rating - Project/course rating (1-10)
 * @param {number} params.hoursTaken - Hours taken to complete (minimum 4 for max reward)
 * @param {string} params.type - "project" or "course"
 * @returns {number} reward in USD (rounded to 2 decimals)
 */
export function calculateStripeRewardUSD({ rating, hoursTaken, type }) {
  const R = Math.max(1, Math.min(10, rating));
  const W = type === "project" ? 1.5 : 1.0;
  const H = Math.max(4, hoursTaken); // Cap minimum at 4 hours
  const reward = 10 * (R / 10) * W * (4 / H);
  return Math.round(reward * 100) / 100; // round to 2 decimals
}
