import express from 'express';
import multer from 'multer';
import { createPost, getPosts } from '../controllers/postController';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to get all posts
router.get('/', getPosts);

// Endpoint to insert a post
router.post('/', upload.single('image'), createPost);

export default router;
