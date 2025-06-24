import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// Register new user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            authProvider: 'local'
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is using Google auth
        if (user.authProvider === 'google') {
            return res.status(401).json({ message: 'Please use Google to login' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Google OAuth callback handler
export const googleCallback = async (req, res) => {
    try {
        const { profile } = req.user;
        console.log('Google callback - Profile reçu:', { id: profile.id, email: profile.emails[0].value, displayName: profile.displayName });
        
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });
        console.log('Utilisateur existant trouvé:', user ? { _id: user._id, email: user.email, authProvider: user.authProvider } : 'null');

        if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                avatar: profile.photos[0].value,
                authProvider: 'google'
            });
            console.log('Nouvel utilisateur Google créé:', { _id: user._id, email: user.email, authProvider: user.authProvider });
        } else if (!user.googleId) {
            // Update existing user with Google info
            user.googleId = profile.id;
            user.authProvider = 'google';
            user.avatar = profile.photos[0].value;
            await user.save();
            console.log('Utilisateur existant mis à jour avec Google:', { _id: user._id, email: user.email, authProvider: user.authProvider });
        }

        // Generate JWT token
        const token = generateToken(user);
        console.log('Token JWT généré pour utilisateur:', { userId: user._id, email: user.email });

        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL}/auth/google/callback?token=${token}`);
    } catch (error) {
        console.error('Google auth error:', error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed`);
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        console.log('=== getCurrentUser START ===');
        console.log('getCurrentUser - req.user:', req.user);
        const userId = req.user._id || req.user.id;
        console.log('getCurrentUser - userId:', userId);
        console.log('getCurrentUser - userId type:', typeof userId);
        
        if (!userId) {
            console.log('No userId found in req.user');
            return res.status(400).json({ message: 'User ID not found' });
        }
        
        const user = await User.findById(userId).select('-password');
        console.log('getCurrentUser - Utilisateur récupéré:', user ? { _id: user._id, email: user.email, authProvider: user.authProvider } : 'null');
        
        if (!user) {
            console.log('User not found in database');
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log('=== getCurrentUser SUCCESS ===');
        res.json(user);
    } catch (error) {
        console.error('=== getCurrentUser ERROR ===');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
  