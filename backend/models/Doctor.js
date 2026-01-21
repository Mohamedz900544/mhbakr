
import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true
    },
    title: { type: String, required: true }, // e.g., "Senior Veterinary Surgeon"
    specialty: { type: String, required: true },
    bio: String,
    about: String,
    price: { type: Number, required: true },
    location: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    imageUrl: String,
    images: [String],
    qualifications: [String],
    available: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    waitingTime: { type: Number, default: 15 }, // in minutes
    mapPosition: {
        top: String,
        left: String
    },
    workingHours: {
        start: String,
        end: String,
        days: [String]
    }
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);
