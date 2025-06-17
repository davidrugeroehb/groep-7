import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

// Import routes
import aboutRoutes from './routes/aboutRoutes.js';
import bedrijfRoutes from './routes/bedrijfRoutes.js';
import studentRoutes from './routes/studentRoutes.js'; // Zorg dat deze import er is
import authRoutes from './routes/authRoutes.js';
import aanvraagRoutes from './routes/aanvraagRoutes.js';
import speeddateRoutes from './routes/speeddateRoutes.js';
import adminRoutes from './routes/adminRoutes.js';


// app config
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors());

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// api endpoints
app.use('/api/auth', authRoutes);

// Gebruik van de routes met hun logische voorvoegsels
app.use('/api/about', aboutRoutes);
app.use('/api/bedrijven', bedrijfRoutes);
app.use('/api/students', studentRoutes); // <-- Zorg dat deze regel correct is: '/api/students'
app.use('/api/aanvragen', aanvraagRoutes);
app.use('/api/speeddates', speeddateRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.send('API WORKING very good');
});

app.listen(port, () => console.log(`Server gestart op http://localhost:${port}`));