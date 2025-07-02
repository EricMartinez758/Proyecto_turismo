// src/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
// ... otras rutas que puedas tener ...
import adminRoutes from './routes/admin.routes.js'; // Importar las nuevas rutas de administración

const app = express();

app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000', // Asegúrate de que tu frontend corre aquí
    credentials: true, // Esto es crucial para enviar y recibir cookies (como tu token)
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', adminRoutes); // Usar las rutas de administración bajo el prefijo /api


export default app;