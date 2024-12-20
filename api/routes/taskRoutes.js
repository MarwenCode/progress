import { Router } from 'express';  // Ensure this import is correct
import { getTasks, createTask  } from '../controllers/taskController.js';

const router = Router();  // Corrected the router initialization

// Define routes
router.get('/', getTasks);  // Get all tasks
router.post('/', createTask);  // Create a new task


export default router;
