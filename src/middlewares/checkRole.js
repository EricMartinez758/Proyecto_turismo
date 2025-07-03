export const checkRole = (allowedRoles) => (req, res, next) => {
  console.log('checkRole: Roles permitidos para esta ruta:', allowedRoles); // <-- ¡AÑADE ESTO!
  console.log('checkRole: Rol del usuario en req.user:', req.user ? req.user.role : 'No hay user.role'); // <-- ¡AÑADE ESTO!

  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: "Acceso denegado. No autenticado o rol no especificado." });
  }

  // Asegúrate de que 'superusuario' esté en la lista de 'allowedRoles'
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Acceso denegado. No tienes los permisos necesarios." });
  }

  next();
};