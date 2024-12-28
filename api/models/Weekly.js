// models/Weekly.js
import mongoose from 'mongoose';

const weeklySchema = new mongoose.Schema({
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

const Weekly = mongoose.model('Weekly', weeklySchema);

export default Weekly;