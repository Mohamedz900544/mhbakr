
import BlogPost from '../models/BlogPost.js';
import ForumTopic from '../models/ForumTopic.js';
import AdoptionPet from '../models/AdoptionPet.js';

// --- BLOGS ---
export const getBlogs = async (req, res) => {
    try {
        const blogs = await BlogPost.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createBlog = async (req, res) => {
    try {
        const blog = await BlogPost.create(req.body);
        res.status(201).json(blog);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

// --- FORUM ---
export const getTopics = async (req, res) => {
    try {
        const topics = await ForumTopic.find().sort({ lastActive: -1 });
        res.json(topics);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createTopic = async (req, res) => {
    try {
        const topic = await ForumTopic.create(req.body);
        res.status(201).json(topic);
    } catch (error) { res.status(400).json({ message: error.message }); }
};

// --- ADOPTION ---
export const getPets = async (req, res) => {
    try {
        const pets = await AdoptionPet.find({ status: { $ne: 'pending' } }).sort({ createdAt: -1 });
        res.json(pets);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createPet = async (req, res) => {
    try {
        const pet = await AdoptionPet.create({ ...req.body, status: 'pending' });
        res.status(201).json(pet);
    } catch (error) { res.status(400).json({ message: error.message }); }
};
