// controllers/weeklyController.js
import Weekly from '../models/Weekly.js';  // You'll need to create this model

// Get all weekly goals for the current user
export const getWeeklyGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching weekly goals for user:', userId);
    
    const weeklyGoals = await Weekly.find({ user: userId }).sort({ createdAt: -1 });
    console.log(`Found ${weeklyGoals.length} weekly goals for user ${userId}`);
    
    res.status(200).json(weeklyGoals);
  } catch (error) {
    console.error('Error fetching weekly goals:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new weekly goal
export const createWeeklyGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Creating weekly goal for user:', userId);
    
    const newWeeklyGoal = new Weekly({ ...req.body, user: userId });
    const savedGoal = await newWeeklyGoal.save();
    
    console.log('Weekly goal created successfully:', savedGoal._id);
    res.status(201).json(savedGoal);
  } catch (error) {
    console.error('Error creating weekly goal:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update weekly goal
export const updateWeeklyGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    console.log('Updating weekly goal:', id, 'for user:', userId);

    const updatedGoal = await Weekly.findOneAndUpdate(
      { _id: id, user: userId },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: "Objectif hebdomadaire non trouvé." });
    }

    console.log('Weekly goal updated successfully');
    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error('Error updating weekly goal:', error);
    res.status(500).json({ message: "Échec de la mise à jour.", error: error.message });
  }
};

// Update only the notes field of a weekly goal
export const updateWeeklyGoalNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { notes } = req.body;

    console.log('Updating notes for weekly goal:', id, 'for user:', userId);

    if (!notes || typeof notes !== "object") {
      return res.status(400).json({ message: "Invalid notes data" });
    }

    const updatedGoal = await Weekly.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { notes } },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    console.log('Weekly goal notes updated successfully');
    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal notes:", error);
    res.status(500).json({ message: "Failed to update goal notes" });
  }
};

// Delete a weekly goal
export const deleteWeeklyGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.user._id;
    console.log('Deleting weekly goal:', goalId, 'for user:', userId);
    
    const deletedGoal = await Weekly.findOneAndDelete({ _id: goalId, user: userId });
    
    if (!deletedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    console.log('Weekly goal deleted successfully');
    res.status(200).json({ message: 'Goal deleted successfully', deletedGoal });
  } catch (error) {
    console.error('Error deleting weekly goal:', error);
    res.status(500).json({ message: "Error deleting goal" });
  }
};




