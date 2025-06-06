import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import bedrijfRoutes from './routes/bedrijfRoutes.js';
import studentRoutes from './routes/studentRoutes.js'; // <--- toegevoegde route

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
app.use('/api/student', studentRoutes); // <--- actieve route
app.use('/api/bedrijf', bedrijfRoutes);

app.get('/', (req, res) => {
  res.send('API WORKING very good');
});

app.listen(port, () => console.log(`Server gestart op http://localhost:${port}`));
