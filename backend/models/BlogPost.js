
import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: String,
    summary: String,
    content: { type: String, required: true }, // HTML content
    author: { type: String, default: 'Admin' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('BlogPost', blogPostSchema);
