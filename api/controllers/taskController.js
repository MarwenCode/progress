import Task from '../models/Task.js';  // Import Task model

// Create a new task
export const createTask = async (req, res) => {
  const { title } = req.body;

  // Validate required fields
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    // Create the task with default progress and completed fields
    const task = await Task.create({ title });
    console.log("Task created successfully:", task);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks from the database
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Unable to fetch tasks." });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { completed, progress } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update the task fields with provided values
    if (completed !== undefined) task.completed = completed;
    if (progress !== undefined) task.progress = progress;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ message: error.message });
  }
};
