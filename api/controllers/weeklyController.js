// controllers/weeklyController.js
import Weekly from '../models/Weekly.js';  // You'll need to create this model

export const getWeeklyGoal = async (req, res) => {
  try {
    const weeklyGoals = await Weekly.find(); // Fetch all weekly goals
    res.status(200).json(weeklyGoals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  
  


export const createWeeklyGoal = async (req, res) => {
  try {
    const newWeeklyGoal = new Weekly(req.body);
    const savedGoal = await newWeeklyGoal.save();
    res.status(201).json(savedGoal);
    console.log('Saving new goal:', req.body);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the selectedDays of a weekly goal
export const updateWeeklyGoal = async (req, res) => {
  const { id } = req.params;
console.log("Goal ID from request:", id); // Debugging log

  const { selectedDays } = req.body;

  try {
    const updatedGoal = await Weekly.findByIdAndUpdate(
      id,
      { selectedDays },
      { new: true } // Return the updated document
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json(updatedGoal);
    console.log('Updated goal:', updatedGoal);
  } catch (error) {
    console.error('Error updating selected days:', error);
    res.status(500).json({ message: 'Failed to update selected days' });
  }
};



//delete a weekly Goal 
export const deleteWeeklyGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    await Weekly.findByIdAndDelete(goalId);
    res.status(200).json(goalId); // Send the deleted goal's ID
  } catch (error) {
    res.status(404).json({ message: "Goal not found" });
  }
};




