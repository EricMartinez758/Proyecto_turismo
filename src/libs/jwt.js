import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export function createAccessToken(payload) { // Payload debería ser { id, correo, role }
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload, // Asegúrate de que este payload ya contenga { id, correo, role }
      TOKEN_SECRET,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}