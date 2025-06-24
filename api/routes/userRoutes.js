import { Router } from "express";
import {
  getUserProfile,
  authenticateUser,
  upload,
  registerUser,
  loginUser,
  updateUserProfile,
  deleteUserProfile,
} from "../controllers/userController.js";

const router = Router();

// User Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authenticateUser, getUserProfile);
router.put(
  "/update",
  authenticateUser,
  upload.single("avatar"),
  updateUserProfile
);
router.delete("/delete", authenticateUser, deleteUserProfile);

export default router; 