import { Router } from 'express';
import {
  createEvent,
  getEventTypes,
  getGuides,
  getDrivers,
  getEvents, // Nueva importación
} from '../controllers/event.controllers.js';

const router = Router();

router.post('/events', createEvent);
router.get('/events', getEvents); // Nueva ruta
router.get('/events/types', getEventTypes);
router.get('/events/guides', getGuides);
router.get('/events/drivers', getDrivers);

export default router;
