import { Schema, model } from "mongoose";

const floatingNotesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);  

export default model("FloatingNotes", floatingNotesSchema); // Exporting the model with a more descriptive name