import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import usersRouter from './routes/users';
import gameRouter from './routes/game';
import scoresRouter from './routes/scores';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/users', usersRouter);
app.use('/api/game', gameRouter);
app.use('/api/scores', scoresRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
