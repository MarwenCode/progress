import Task from '../models/task.js';  // Import Task model



// Create a new task
export const createTask = async (req, res) => {
  const { title } = req.body;

  // Validate the title (no icon validation)
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    // Create the task with only the title
    const task = await Task.create({ title });
    console.log("Task created:", task); // Console log task creation for debugging
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

// Update an existing task

// controllers/taskController.js

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { progress } = req.body;

    // Find the task and update it
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.progress = progress;  // Update progress
    await task.save();  // Save the updated task

    return res.status(200).json(task);  // Respond with the updated task
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an existing task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: error.message });
  }
};

