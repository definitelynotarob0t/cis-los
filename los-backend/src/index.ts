import express from 'express';
import cors from 'cors'; 
import { PORT } from './util/config';
import { connectToDatabase } from './util/db';
import { errorHandler, unknownEndpoint } from './util/middleware';
import './types';

// Import routers
import pitchRouter from './routes/pitches';
import userRouter from './routes/users';
import loginRouter from './routes/login';
import logoutRouter from './routes/logout';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/pitches', pitchRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);

// Error handling
app.use(errorHandler)
app.use(unknownEndpoint)


const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}, http://localhost:${PORT}`);
  });
};

start();
