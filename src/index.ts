import express from 'express';
import router from 'routes';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
