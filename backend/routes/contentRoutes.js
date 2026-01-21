
import express from 'express';
import { getBlogs, createBlog, getTopics, createTopic, getPets, createPet } from '../controllers/contentController.js';

const router = express.Router();

router.get('/blogs', getBlogs);
router.post('/blogs', createBlog);

router.get('/forum', getTopics);
router.post('/forum', createTopic);

router.get('/adoption', getPets);
router.post('/adoption', createPet);

export default router;
