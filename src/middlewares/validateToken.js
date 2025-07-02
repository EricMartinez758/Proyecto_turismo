import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: ["No hay token, autorización denegada."] });
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).json({ message: ["Token inválido o expirado."] });
    }

    // Aquí, 'user' será el payload decodificado del token, que DEBE incluir el 'role'
    req.user = user; // Esto hace que req.user.id y req.user.role estén disponibles en los siguientes middlewares/controladores
    next();
  });
};