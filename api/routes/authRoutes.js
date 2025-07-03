import express from 'express';
import passport from 'passport';
import { googleCallback, getCurrentUser, register, login } from '../controllers/authController.js';
import { googleConfig } from '../config/google.config.js';
import { authenticateUser } from '../controllers/userController.js';

const router = express.Router();

const API_URL = process.env.API_URL; // or whatever variable you need

// Regular email/password authentication
router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { scope: googleConfig.scope })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    googleCallback
);

// Get current user (protected route)
router.get('/me', authenticateUser, getCurrentUser);

export default router; 