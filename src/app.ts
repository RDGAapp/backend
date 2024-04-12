import express from 'express';
import cors from 'cors';
import rootRouter from 'routes';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://rdga.ru'
        : 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(rootRouter);

export default app;
