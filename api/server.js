import express from 'express';
import { config } from 'dotenv';
import cors from 'cors'; // Import cors middleware
import connectDB from './config/db.js'; // Database connection
import taskRoutes from './routes/taskRoutes.js'; // Import task routes



// Load environment variables from .env
config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  })
);
app.options('*', cors()); // Handle preflight requests

app.use(express.json()); // Parse JSON payloads

// Routes
app.use('/api/tasks/', taskRoutes); // Task-related routes


// Root route
app.get('/', (req, res) => {
  res.send('BarBoom API is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
