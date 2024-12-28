// controllers/weeklyController.js
import Weekly from '../models/Weekly.js';  // You'll need to create this model

// controllers/weeklyController.js
export const getWeeklyGoal = async (req, res) => {
    console.log("Getting weekly goals");  // Add this
    try {
      const weeklyGoals = await Weekly.find();
      console.log("Found goals:", weeklyGoals);  // Add this
      res.status(200).json(weeklyGoals);
    } catch (error) {
      console.error("Error in getWeeklyGoal:", error);  // Add this
      res.status(500).json({ message: error.message });
    }
  };

export const createWeeklyGoal = async (req, res) => {
  try {
    const newGoal = new Weekly({
      name: req.body.name,
      selectedDays: req.body.selectedDays,
      details: req.body.details,
      notes: req.body.notes,
      progress: req.body.progress
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};