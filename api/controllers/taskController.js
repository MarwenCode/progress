import Task from '../models/Task.js';  // Import Task model

// Create a new task
export const createTask = async (req, res) => {
  const { title, description, progress = 0 } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      progress,
    });
    console.log("Task created successfully:", task);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ message: error.message });
  }
  
};



export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks from the database
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Unable to fetch tasks." });
  }
};

