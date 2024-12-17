import Task from '../models/Task.js';  // Import Task model

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();  // Use Task model to find all tasks
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  const { title, description, goalTitle, goalDate, progress = 0 } = req.body;

  if (!title || !goalTitle || !goalDate) {
    return res.status(400).json({ message: 'Title, goalTitle, and goalDate are required' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      goalTitle,
      goalDate,
      progress, // Initialize with 0 or the provided progress
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task progress
export const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });  // Update task by ID
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);  // Delete task by ID
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
