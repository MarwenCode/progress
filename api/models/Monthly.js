import { Schema, model } from "mongoose";

const monthlySchema = new Schema(
  {
    month: {
      type: String,
      required: true,
      unique: true,
    },
    goalName: {
      type: String,
      required: true,
    },
    goalDetails: {
      type: String,
    },
    tasks: {
      type: [
        {
          text: String,
          completed: Boolean,
        },
      ],
      default: [], // Initialize tasks as an empty array
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("monthlyGoal", monthlySchema);