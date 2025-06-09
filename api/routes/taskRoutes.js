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

// Daily Tasks
router.get("/daily", getTasks);
router.post("/daily", createTask);
router.put("/daily/:id", updateTask);
router.delete("/daily/:id", deleteTask);

// Weekly Goals
router.post("/weekly", createWeeklyGoal);
router.get("/weekly", getWeeklyGoal);
router.put("/weekly/:id", updateWeeklyGoal);
router.put("/weekly/notes/:id", updateWeeklyGoalNotes);
router.delete("/weekly/:id", deleteWeeklyGoal);

// Monthly Goals
router.get("/monthly", getMonthlyGoals);
router.post("/monthly", createMonthlyGoal);
router.post("/monthly/:goalId/tasks", addTaskToGoal);
router.patch("/monthly/:goalId/tasks/:taskId", completedTaskChecked);
router.delete("/monthly/:id", deleteMonthlyGoal);

// Floating Notes
router.get("/floating-notes", getFloatingNotes);
router.post("/floating-notes", createFloatingNote);
router.delete("/floating-notes/:id", deleteFloatingNote);

// User Auth
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/profile", authenticateUser, getUserProfile);
router.put(
  "/user/update",
  authenticateUser,
  upload.single("avatar"),
  updateUserProfile
);
router.delete("/user/delete", authenticateUser, deleteUserProfile);

export default router;
