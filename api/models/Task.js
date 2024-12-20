import { Schema, model } from 'mongoose';

// Define the schema for tasks
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
    },
    progress: {
      type: Number,
      default: 0, // Start progress at 0%
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

export default model('Task', taskSchema);
