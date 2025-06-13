import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

//voor aboutbeheer
import aboutRoutes from './routes/aboutRoutes.js';


// Import bestaande routes
import bedrijfRoutes from './routes/bedrijfRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';
// NIEUW: Importeer de nieuwe aanvraag routes
import aanvraagRoutes from './routes/aanvraagRoutes.js';

// app config
dotenv.config();
const app = express();
app.use('/api/about', aboutRoutes);
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/auth', authRoutes); // Voor universele login

// Bestaande specifieke routes (niet-authenticatie functionaliteiten)
app.use('/api/student', studentRoutes); // Voor student-specifieke routes (bijv. alle speeddates ophalen)
app.use('/api/bedrijf', bedrijfRoutes); // Voor bedrijf-specifieke routes (bijv. speeddates aanmaken/ophalen)
// NIEUW: Gebruik de aanvraag routes
app.use('/api', aanvraagRoutes); // Gebruik /api als basis voor de aanvraag routes

app.get('/', (req, res) => {
  res.send('API WORKING very good');
});

app.listen(port, () => console.log(`Server gestart op http://localhost:${port}`));
