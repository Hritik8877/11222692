import express from 'express';
import logger from './middleware/logger.js';
import urlRoutes from './routes/url.Routes.js';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(logger);
app.use('/', urlRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
