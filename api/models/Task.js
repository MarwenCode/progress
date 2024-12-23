import { Schema, model } from 'mongoose';

// Define the schema for tasks
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    progress: {
      type: Number,
      default: 0, // Start progress at 0%
    },
    completed: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

export default model('Task', taskSchema);
