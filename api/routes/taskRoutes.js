import { Router } from "express";
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
  deleteMonthlyGoal,
} from "../controllers/monthlyController.js";

import {
  getUserProfile,
  authenticateUser,
  upload,
  registerUser,
  loginUser,
  updateUserProfile,
  deleteUserProfile,
} from "../controllers/userController.js";

import {
  deleteFloatingNote,
  createFloatingNote,
  getFloatingNotes,
} from "../controllers/floatingNotesController.js";

const router = Router();

// Daily Tasks (protected routes)
router.get("/daily", authenticateUser, getTasks);
router.post("/daily", authenticateUser, createTask);
router.put("/daily/:id", authenticateUser, updateTask);
router.delete("/daily/:id", authenticateUser, deleteTask);

// Weekly Goals (protected routes)
router.post("/weekly", authenticateUser, createWeeklyGoal);
router.get("/weekly", authenticateUser, getWeeklyGoal);
router.put("/weekly/:id", authenticateUser, updateWeeklyGoal);
router.put("/weekly/notes/:id", authenticateUser, updateWeeklyGoalNotes);
router.delete("/weekly/:id", authenticateUser, deleteWeeklyGoal);

// Monthly Goals (protected routes)
router.get("/monthly", authenticateUser, getMonthlyGoals);
router.post("/monthly", authenticateUser, createMonthlyGoal);
router.post("/monthly/:goalId/tasks", authenticateUser, addTaskToGoal);
router.patch("/monthly/:goalId/tasks/:taskId", authenticateUser, completedTaskChecked);
router.delete("/monthly/:id", authenticateUser, deleteMonthlyGoal);

// Floating Notes (protected routes)
router.get("/floating-notes", authenticateUser, getFloatingNotes);
router.post("/floating-notes", authenticateUser, createFloatingNote);
router.delete("/floating-notes/:id", authenticateUser, deleteFloatingNote);

export default router;
