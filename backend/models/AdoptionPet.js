
import mongoose from 'mongoose';

const adoptionPetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // Cat, Dog
    breed: String,
    gender: { type: String, enum: ['male', 'female'], default: 'male' },
    age: String,
    location: String,
    image: String,
    story: String,
    vaccinated: { type: Boolean, default: false },
    ownerName: String,
    phone: String,
    status: { 
        type: String, 
        enum: ['available', 'adopted', 'pending'], 
        default: 'pending' // Pending admin approval
    }
}, { timestamps: true });

export default mongoose.model('AdoptionPet', adoptionPetSchema);
