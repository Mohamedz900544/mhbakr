
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    doctor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: true 
    },
    doctorName: String, 
    doctorSpecialty: String, 
    client: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    clientName: String, // Denormalized for easier display or guest name
    guestDetails: { 
        name: String, 
        phone: String 
    },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    time: { type: String, required: true }, // Format: HH:MM AM/PM
    status: { 
        type: String, 
        enum: ['upcoming', 'completed', 'cancelled'], 
        default: 'upcoming' 
    },
    type: { type: String, default: 'checkup' },
    petName: String,
    price: Number,
    location: String
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
