
import mongoose from 'mongoose';

const forumTopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    authorRole: { type: String, default: 'client' }, // client, doctor
    tag: String,
    content: String,
    replies: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('ForumTopic', forumTopicSchema);
