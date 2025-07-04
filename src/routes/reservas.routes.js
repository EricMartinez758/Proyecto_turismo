import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
    getReservations,
    createReservation,
    updateReservationStatus, 
    cancelReservation,
    updateReservation, 
    getAvailableClients, 
    getAvailableActivities,
    processPayment 
} from '../controllers/reservas.controllers.js'; 

const router = Router();

router.use(authRequired);

router.get('/reservas', getReservations);
router.post('/reservas', createReservation);
router.put('/reservas/status/:id', updateReservationStatus); 
router.put('/reservas/cancel/:id', cancelReservation);
router.put('/reservas/:id', updateReservation); 

router.post('/reservas/payment/:id', processPayment);

router.get('/reservas/clients', getAvailableClients);
router.get('/reservas/activities', getAvailableActivities);

export default router;