import express from 'express';
import cors from 'cors';
import rootRouter from 'routes';

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? 'https://rdga.ru' : '*' }));
app.use(rootRouter);

export default app;
