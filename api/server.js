import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Convertir __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis .env
config();

// Connexion à MongoDB
connectDB();

// Initialisation d'Express
const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // URL du frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors()); // Gérer les requêtes preflight
app.use(express.json()); // Parse les payloads JSON

// Servir les fichiers statiques (uploads d'avatars)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/tasks', taskRoutes);

// Route racine
app.get('/', (req, res) => {
  res.send('STEPS API is running!');
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
