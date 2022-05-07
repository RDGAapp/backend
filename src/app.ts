import express from 'express';
import cors from 'cors';
import rootRouter from 'routes';
import playerRouter from 'routes/players';

const app = express();

app.use(express.json());
app.use(cors());
app.use(rootRouter);
app.use('/players', playerRouter)

export default app;
