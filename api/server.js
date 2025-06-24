import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables first
config({ path: path.join(__dirname, '.env') });

// Debug: Log the current directory and .env path
console.log('Current directory:', __dirname);
console.log('Looking for .env at:', path.join(__dirname, '.env'));

// Debug: Log environment variables (remove in production)
console.log('Environment variables:', {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
});

// Verify required environment variables
const requiredEnvVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import passport from './config/passport.js';
import userRoutes from './routes/userRoutes.js';

// Connexion à MongoDB
connectDB();

// Initialisation d'Express
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.options('*', cors()); // Gérer les requêtes preflight
app.use(express.json()); // Parse les payloads JSON
app.use(passport.initialize()); // Initialize Passport

// Servir les fichiers statiques (uploads d'avatars)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Route racine
app.get('/', (req, res) => {
  res.send('STEPS API is running!');
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
