
import express from 'express';
import { createAppointment, getMyAppointments, getDoctorAppointments } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', createAppointment);
router.get('/my/:userId', getMyAppointments);
router.get('/doctor/:doctorId', getDoctorAppointments);

export default router;
