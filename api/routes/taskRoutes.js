import { Router } from "express"; // Ensure this import is correct
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import {
  createWeeklyGoal,
  getWeeklyGoal,
  deleteWeeklyGoal,
  updateWeeklyGoal,
  updateWeeklyGoalNotes,
  
} from "../controllers/weeklyController.js";
import {
  getMonthlyGoals,
  createMonthlyGoal,
  addTaskToGoal,
  completedTaskChecked,
  deleteMonthlyGoal
} from "../controllers/monthlyController.js";

import { registerUser, loginUser } from "../controllers/userController.js";

const router = Router(); // Corrected the router initialization

// Define routes daily
router.get("/daily", getTasks); // Get all tasks
router.post("/daily", createTask); // Create a new task
router.put("/daily/:id", updateTask);
router.delete("/daily/:id", deleteTask);

// Define routes Weekly

router.post("/weekly", createWeeklyGoal);
router.get("/weekly", getWeeklyGoal);
router.put("/weekly/:id", updateWeeklyGoal);
router.delete("/weekly/:id", deleteWeeklyGoal);
router.put("/weekly/notes/:id", updateWeeklyGoalNotes);

// Routes Monthly
router.get("/monthly", getMonthlyGoals);
router.post("/monthly", createMonthlyGoal);
router.delete("/monthly/:id", deleteMonthlyGoal);
router.post("/monthly/:goalId/tasks", addTaskToGoal);
router.patch("/monthly/:goalId/tasks/:taskId", completedTaskChecked);



// User Routes for Authentication
router.post("/user/register", registerUser); // Route for user registration
router.post("/user/login", loginUser); // Route for user login




export default router;
