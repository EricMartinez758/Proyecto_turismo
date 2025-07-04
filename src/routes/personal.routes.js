import { Router } from 'express';
import {
  createPersonal,
  getPersonal,
  getPersonalById,
  updatePersonal,
  toggleStatus,
  getBancosList,
  getTiposCondicionMedicaList
} from '../controllers/personal.controllers.js';

const router = Router();

// Rutas para personal
router.post('/personal', createPersonal);
router.get('/personal', getPersonal);
router.get('/personal/:id', getPersonalById);
router.put('/personal/:id', updatePersonal);
router.patch('/personal/:id/toggle-status', toggleStatus);

// Rutas para datos auxiliares
router.get('/bancos', getBancosList);
router.get('/tipos-condicion-medica', getTiposCondicionMedicaList);

export default router;