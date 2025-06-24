import MonthlyGoal from "../models/Monthly.js";

// Get all monthly goals for the current user
export const getMonthlyGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching monthly goals for user:', userId);
    
    const goals = await MonthlyGoal.find({ user: userId }).sort({ createdAt: -1 });
    console.log(`Found ${goals.length} monthly goals for user ${userId}`);
    
    res.status(200).json(goals);
  } catch (error) {
    console.error('Error retrieving monthly goals:', error);
    res.status(500).json({ message: "Error retrieving monthly goals", error });
  }
};

// Create a new monthly goal
export const createMonthlyGoal = async (req, res) => {
  try {
    const { month, goalName, goalDetails } = req.body;
    const userId = req.user._id;

    console.log('Creating monthly goal for user:', userId);

    if (!month || !goalName) {
      return res.status(400).json({ message: "Month and Goal Name are required" });
    }

    const newGoal = new MonthlyGoal({ 
      month, 
      goalName, 
      goalDetails, 
      tasks: [],
      user: userId
    });
    await newGoal.save();

    console.log('Monthly goal created successfully:', newGoal._id);
    res.status(201).json(newGoal);
  } catch (error) {
    console.error("Error creating monthly goal:", error);
    res.status(500).json({ message: "Error creating monthly goal", error: error.message });
  }
};

// Delete monthly goal
export const deleteMonthlyGoal = async(req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.user._id;
    console.log('Deleting monthly goal:', goalId, 'for user:', userId);
    
    const goal = await MonthlyGoal.findOneAndDelete({ _id: goalId, user: userId });
    
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    
    console.log('Monthly goal deleted successfully');
    res.status(200).json({ message: 'Goal deleted successfully', deletedGoal: goal });
  } catch (error) {
    console.error('Error deleting monthly goal:', error);
    res.status(500).json({ message: "Error deleting goal", error: error.message });
  }
};

// Add a task to a monthly goal
export const addTaskToGoal = async (req, res) => {
  try {
    const goalId = req.params.goalId;
    const userId = req.user._id;
    const { text } = req.body;

    console.log('Adding task to monthly goal:', goalId, 'for user:', userId);

    const goal = await MonthlyGoal.findOne({ _id: goalId, user: userId });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.tasks.push({ text, completed: false });
    await goal.save();

    console.log('Task added successfully to monthly goal');
    return res.status(200).json(goal);
  } catch (error) {
    console.error('Error adding task to monthly goal:', error);
    return res.status(500).json({ message: "Error adding task" });
  }
};

// Toggle task completion
export const completedTaskChecked = async (req, res) => {
  try {
    const { goalId, taskId } = req.params;
    const userId = req.user._id;
    const { completed } = req.body;

    console.log('Toggling task completion for user:', userId);

    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "Invalid value for completed. Must be true or false." });
    }

    const goal = await MonthlyGoal.findOne({ _id: goalId, user: userId });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const task = goal.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = completed;
    await goal.save();

    console.log('Task completion toggled successfully');
    return res.status(200).json(goal);
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Error updating task", error: error.message });
  }
};


