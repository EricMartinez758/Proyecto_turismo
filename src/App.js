// src/app.js (del backend)
import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import router from './routes/task.routes.js';
import cors from 'cors';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// *** ¡CAMBIA ESTA LÍNEA! ***
app.use(cors({
 origin: 'http://localhost:3000', 
 credentials: true, 
}));

app.use("/api",authRoutes)
app.use("/api", router);

export default app;