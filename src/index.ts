import express, { Request, Response } from 'express';

const PORT = process.env.PORT || 8080;

const app = express();

app.get('/coffee', (req: Request, res: Response) => {
  res.status(418).send("I'm a teapot");
});

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
