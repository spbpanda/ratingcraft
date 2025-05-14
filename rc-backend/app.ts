import express from 'express';
import cors from 'cors';
import routes from './routes/index';

const app = express();
const PORT = Number(process.env.PORT) || 10000;

const corsOptions = {
  origin: 'http://localhost:3030', // замени на адрес фронтенда  'https://ratingcraft.onrender.com'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // если используешь cookies
};

app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use('/api', routes);


// // Start server prod
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running on http://0.0.0.0:${PORT}`);
// });

// Start server
app.listen(PORT, 'localhost', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});