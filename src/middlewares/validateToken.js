import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js'; 

export const authRequired = (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No se proporcionó un token." });
    }

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        
        if (err) {
            console.error("Error al verificar token JWT:", err); // Para depuración
            return res.status(403).json({ message: "Token inválido o expirado." });
        }

        req.user = user;

        next();
    });
};