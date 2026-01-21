
import Appointment from '../models/Appointment.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public (or Private)
export const createAppointment = async (req, res) => {
    try {
        const { 
            doctorId, date, time, petName, guestDetails, 
            userId, price, location, doctorName, doctorSpecialty, clientName
        } = req.body;

        const appointment = await Appointment.create({
            doctor: doctorId,
            doctorName,
            doctorSpecialty,
            date,
            time,
            petName,
            client: userId || null,
            clientName: clientName || (guestDetails ? guestDetails.name : 'Unknown'),
            guestDetails,
            price,
            location
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user appointments
// @route   GET /api/appointments/my/:userId
// @access  Private
export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ client: req.params.userId }).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private (Doctor)
export const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.params.doctorId }).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
