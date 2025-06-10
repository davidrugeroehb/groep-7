import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

// Import existing routes
import bedrijfRoutes from './routes/bedrijfRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
// NEW: Import the new authentication routes
import authRoutes from './routes/authRoutes.js';

// app config
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
// OLD: app.use('/api/student', studentRoutes); // This now primarily handles non-login student routes
// OLD: app.use('/api/bedrijf', bedrijfRoutes); // This now primarily handles non-login company routes

// NEW: Unified authentication route
app.use('/api/auth', authRoutes);

// Existing specific routes (ensure these still exist for non-auth functionalities)
app.use('/api/student', studentRoutes); // Keep for non-login student routes (e.g., getting all speeddates)
app.use('/api/bedrijf', bedrijfRoutes); // Keep for non-login company routes (e.g., creating/getting company speeddates)


app.get('/', (req, res) => {
  res.send('API WORKING very good');
});

app.listen(port, () => console.log(`Server gestart op http://localhost:${port}`));
