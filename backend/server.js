import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

// Import routes
import aboutRoutes from './routes/aboutRoutes.js';
import bedrijfRoutes from './routes/bedrijfRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aanvraagRoutes from './routes/aanvraagRoutes.js';
import speeddateRoutes from './routes/speeddateRoutes.js';


// app config
dotenv.config();
const app = express();
const port = process.env.PORT || 4000; // de poort van de backend is 4000

// middlewares
app.use(express.json());
app.use(cors()); // Activez CORS pour toutes les requêtes

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// api endpoints
app.use('/api/auth', authRoutes);

app.use('/api/about', aboutRoutes); // Voor de about-routes
app.use('/api/bedrijven', bedrijfRoutes); // Voor de bedrijfsroutes (inclusief tellers)
app.use('/api/student', studentRoutes); // Voor de studentenroutes (inclusief tellers)
app.use('/api/aanvragen', aanvraagRoutes); // Voor de aanvraagroutes (inclusief tellers en de pending-lijst)
app.use('/api/speeddates', speeddateRoutes); // Voor de speeddate-routes (inclusief tellers)


app.get('/', (req, res) => {
  res.send('API WORKING very good');
});

app.listen(port, () => console.log(`Server gestart op http://localhost:${port}`));