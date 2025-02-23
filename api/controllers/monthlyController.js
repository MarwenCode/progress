import MonthlyGoal from "../models/Monthly.js";

// Get all monthly goals
export const getMonthlyGoals = async (req, res) => {
  try {
    const goals = await MonthlyGoal.find();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving monthly goals", error });
  }
};

// Create a new monthly goal
export const createMonthlyGoal = async (req, res) => {
  try {
    const { month, goalName, goalDetails } = req.body;

    // Validate required fields
    if (!month || !goalName) {
      return res.status(400).json({ message: "Month and Goal Name are required" });
    }

    // Create a new goal with tasks initialized as an empty array
    const newGoal = new MonthlyGoal({ month, goalName, goalDetails, tasks: [] });
    await newGoal.save();

    res.status(201).json(newGoal);
  } catch (error) {
    console.error("Error creating monthly goal:", error);
    res.status(500).json({ message: "Error creating monthly goal", error: error.message });
  }
};

export const deleteMonthlyGoal = async(req, res) => {
  try {
    const goalId = req.params.id
    const goal = await MonthlyGoal.findByIdAndDelete(goalId);
    res.status(200).json(goal);
  } catch (error) {
    res.status(404).json({message : "Goal not found"})
    
  }
}

// Add a task to a monthly goal
export const addTaskToGoal = async (req, res) => {
  try {
    const goalId = req.params.goalId;
    const { text } = req.body;

    const goal = await MonthlyGoal.findById(goalId); // Trouver l'objectif par ID
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.tasks.push({ text, completed: false }); // Ajouter la tâche
    await goal.save(); // Sauvegarder l'objectif mis à jour

    return res.status(200).json(goal); // Renvoie l'objectif mis à jour
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding task" });
  }
};


export const completedTaskChecked = async (req, res) => {
  try {
    const { goalId, taskId } = req.params;
    const { completed } = req.body;

    // Vérifier si la valeur `completed` est bien un booléen
    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "Invalid value for completed. Must be true or false." });
    }

    // Trouver l'objectif correspondant
    const goal = await MonthlyGoal.findById(goalId);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Trouver la tâche dans la liste des tâches
    const task = goal.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Mettre à jour l'état de la tâche
    task.completed = completed;
    await goal.save();

    // Envoyer la réponse avec l'objectif mis à jour
    return res.status(200).json(goal);
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Error updating task", error: error.message });
  }
};


