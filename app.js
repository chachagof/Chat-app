import express from 'express';
import apis from './apis/index.js';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use('/api',apis)


app.listen(PORT, () => {
  console.log(`It's listen on http://localhost:${PORT}`);
});
