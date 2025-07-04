// src/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js'; 
import reservasRoutes from './routes/reservas.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', adminRoutes); 
app.use('/api', reservasRoutes);


export default app;