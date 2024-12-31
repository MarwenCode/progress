// models/Weekly.js
import { Schema, model } from 'mongoose';


const weeklySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  selectedDays: {
    type: [String],
    default: []
  },
  details: {
    type: String
  },
  notes: {
    type: Object,
    default: {}
  },
  progress: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default model('Weekly', weeklySchema);

