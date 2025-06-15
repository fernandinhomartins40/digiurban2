
// HOW TO RUN THE BACKEND LOCALLY
// 1. Set up your environment variables (see .env.example).
// 2. Start your PostgreSQL instance and ensure DATABASE_URL is correct.
// 3. Run the backend:   npm run dev:server   (requires ts-node)
// 4. For fullstack development, use:   npm run dev   (requires concurrently)
// The frontend will run on :8080 and API requests will proxy to :5000

import express from 'express';
import cors from 'cors';
import usersRouter from './api/users';
import chatRoutes from './api/chat';
import alertRoutes from './api/alerts';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/chat', chatRoutes);
app.use('/api/alerts', alertRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
