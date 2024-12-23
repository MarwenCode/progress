import { Schema, model } from 'mongoose';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    progress: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    icon: { type: String, default: 'tree' },
  },
  {
    timestamps: true,
  }
);

export default model('Task', taskSchema);




