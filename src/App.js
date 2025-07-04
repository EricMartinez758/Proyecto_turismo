import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
//rutas de backend
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import eventRoutes from './routes/event.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

import personalRoutes from './routes/personal.routes.js';

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', reservasRoutes);
app.use('/api', personalRoutes);
app.use('/api', eventRoutes);

app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

export default app;
