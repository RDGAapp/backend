import express from 'express';
import cors from 'cors';
import rootRouter from 'routes';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://rdga.ru' : '*',
  }),
);
app.use(rootRouter);

export default app;
