import Task from '../models/task.js';  // Import Task model



// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;

    console.log('Creating task for user:', userId, 'Title:', title);

    // Validate the title
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Create the task with user reference
    const task = await Task.create({ 
      title,
      user: userId
    });
    
    console.log("Task created successfully:", task._id);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({ message: error.message });
  }
};





// Get all tasks for the current user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching tasks for user:', userId);
    
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    console.log(`Found ${tasks.length} tasks for user ${userId}`);
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Unable to fetch tasks." });
  }
};

// Update an existing task
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;
    const { progress } = req.body;

    console.log('Updating task:', taskId, 'for user:', userId);

    // Find the task and update it (only if it belongs to the user)
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      console.log('Task not found or does not belong to user');
      return res.status(404).json({ message: 'Task not found' });
    }

    task.progress = progress;
    await task.save();

    console.log('Task updated successfully');
    return res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an existing task
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    console.log('Deleting task:', taskId, 'for user:', userId);

    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) {
      console.log('Task not found or does not belong to user');
      return res.status(404).json({ message: 'Task not found' });
    }
    
    console.log('Task deleted successfully');
    res.status(200).json({ message: 'Task deleted successfully', deletedTask: task });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ message: error.message });
  }
};

