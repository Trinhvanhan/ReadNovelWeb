// app.js or server.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import ApiRouter from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/comicApp').then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Use your ApiRouter
app.use('/api', ApiRouter);


// Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
