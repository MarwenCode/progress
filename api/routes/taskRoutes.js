import { Router } from 'express';  // Ensure this import is correct
import { getTasks, createTask, updateTask, deleteTask  } from '../controllers/taskController.js';

const router = Router();  // Corrected the router initialization

// Define routes
router.get('/', getTasks);  // Get all tasks
router.post('/', createTask);  // Create a new task
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);


export default router;
