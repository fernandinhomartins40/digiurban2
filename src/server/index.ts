
import express from 'express';
import cors from 'cors';
import usersRouter from './api/users';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', usersRouter);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
