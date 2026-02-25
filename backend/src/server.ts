import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import articlesRouter from './routes/articles';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api/articles', articlesRouter);

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => console.log('Mongo connected'))
  .catch((err) => console.log(err));

app.listen(8080, () => {
  console.log('API running on 8080');
});
