// src/routes/admin.routes.js
import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js'; // Tu middleware de autenticación
import { checkRole } from '../middlewares/checkRole.js'; // Tu nuevo middleware para roles
import {
  getTrabajadores,
  updateTrabajador,
  getRolesList,
} from '../controllers/admin.controllers.js'; // Tus nuevos controladores

const router = Router();

// Rutas protegidas: Solo 'superadmin' puede acceder a estas
router.get('/admin/trabajadores', authRequired, checkRole(['superusuario']), getTrabajadores);
router.put('/admin/trabajadores/:id', authRequired, checkRole(['superusuario']), updateTrabajador);

// Ruta para obtener la lista de roles (puede ser protegida solo para 'superadmin' si deseas)
// La he dejado protegida para 'superadmin' por coherencia con el componente de frontend
router.get('/roles', authRequired, checkRole(['superusuario']), getRolesList);

export default router;