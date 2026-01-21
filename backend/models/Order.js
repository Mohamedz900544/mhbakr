
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest checkout
    guestDetails: {
        name: String,
        phone: String,
        address: String
    },
    items: [{
        productId: { type: String }, // Store ID reference
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    total: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['processing', 'shipped', 'delivered', 'cancelled'], 
        default: 'processing' 
    },
    paymentMethod: { type: String, default: 'cash' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
