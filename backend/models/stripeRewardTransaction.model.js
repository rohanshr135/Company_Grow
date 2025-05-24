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
