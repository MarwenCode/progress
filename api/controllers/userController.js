import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convertir __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définir le chemin correct pour le répertoire "uploads" à la racine du projet
const uploadPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuration Multer pour le téléversement
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

// Middleware d'authentification
export const authenticateUser = async (req, res, next) => {
  try {
    console.log('=== authenticateUser START ===');
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    console.log('Token reçu:', token.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password');
    console.log('Utilisateur trouvé en base:', user ? { _id: user._id, email: user.email, authProvider: user.authProvider } : 'null');
    
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = user;
    console.log('=== authenticateUser SUCCESS ===');
    next();
  } catch (error) {
    console.error('=== authenticateUser ERROR ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

// Contrôleur pour l'inscription
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérification des champs requis
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création du nouvel utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      authProvider: 'local'
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      avatar: newUser.avatar,
      token
    });
  } catch (error) {
    console.error('Erreur dans registerUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Contrôleur pour la connexion
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email reçu:", email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Utilisateur non trouvé pour l'email:", email);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Check if user is using Google auth
    if (user.authProvider === 'google') {
      return res.status(401).json({ message: 'Please use Google to login' });
    }

    // Comparaison du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Mot de passe incorrect pour l'utilisateur:", email);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token
    });
  } catch (error) {
    console.error('Erreur dans loginUser:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Contrôleur pour récupérer le profil de l'utilisateur
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Erreur dans getUserProfile:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Contrôleur pour la mise à jour du profil
export const updateUserProfile = async (req, res) => {
  try {
    console.log("Fichier reçu:", req.file);
    console.log("Données reçues:", req.body);

    if (!req.user || !req.user._id) {
      console.error("No authenticated user found in request.");
      return res.status(401).json({ message: "User not authenticated.", user: null });
    }

    const userId = req.user._id;
    const { username, email, password } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found in database.");
      return res.status(404).json({ message: "User not found.", user: null });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (error) {
    console.error("Erreur serveur dans updateUserProfile:", error);
    // Never leak internal error details to the client
    res.status(500).json({ message: "Server error in updateUserProfile.", user: null });
  }
};

// Contrôleur pour la suppression du profil
export const deleteUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'User not authenticated or not found.' });
    }

    const userId = req.user._id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Erreur dans deleteUserProfile:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
