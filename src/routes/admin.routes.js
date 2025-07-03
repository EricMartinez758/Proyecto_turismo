import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js'; 
import { checkRole } from '../middlewares/checkRole.js'; 
import {
  getTrabajadores,
  updateTrabajador,
  createTrabajador,
  getRolesList,
} from '../controllers/admin.controllers.js'; 

const router = Router();


router.get('/admin/trabajadores', authRequired, checkRole(['superusuario']), getTrabajadores);
router.put('/admin/trabajadores/:id', authRequired, checkRole(['superusuario']), updateTrabajador);
router.post('/admin/trabajadores', createTrabajador);
router.get('/roles', authRequired, checkRole(['superusuario']), getRolesList);

export default router;