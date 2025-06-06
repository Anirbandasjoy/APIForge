import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import errorHandler from './app/middlewares/errorHandler';
import notFoundHandler from './app/middlewares/notFoundHandler';
import morgan from 'morgan';
const app = express();

app.use(morgan('dev'));

app.use(
  cors({
    origin: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    credentials: true,

    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    preflightContinue: false,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the API',
    status: 'success',
    data: {
      name: 'API',
      version: '1.0.0',
      description: 'A simple Backend API with TypeScript and Express',
    },
  });
});

app.use('/api/v1', router);

// Catch-all route for handling 404 Not Found
app.use(notFoundHandler);

// Error Handling Middleware
app.use(errorHandler);

export default app;
