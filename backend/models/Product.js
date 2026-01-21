
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'food', 'accessories', 'meds'
    price: { type: Number, required: true },
    oldPrice: Number,
    image: { type: String, required: true },
    images: [String], // Gallery
    description: String,
    rating: { type: Number, default: 5 },
    badge: String, // e.g., 'Best Seller', 'New'
    stock: { type: Number, default: 50 },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
