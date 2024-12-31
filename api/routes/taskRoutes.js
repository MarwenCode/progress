import { Router } from 'express';  // Ensure this import is correct
import { getTasks, createTask, updateTask, deleteTask  } from '../controllers/taskController.js';
import { createWeeklyGoal, getWeeklyGoal, deleteWeeklyGoal, updateWeeklyGoal } from '../controllers/weeklyController.js';

const router = Router();  // Corrected the router initialization

// Define routes daily
router.get('/daily', getTasks);  // Get all tasks
router.post('/daily', createTask);  // Create a new task
router.put('/daily/:id', updateTask);
router.delete('/daily/:id', deleteTask);


// Define routes Weekly

router.post("/weekly", createWeeklyGoal);
router.get("/weekly", getWeeklyGoal);
router.put('/weekly/:id', updateWeeklyGoal);
router.delete("/weekly/:id", deleteWeeklyGoal);


export default router;
