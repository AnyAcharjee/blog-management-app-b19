import { Router } from 'express';
import { createBlog, updateBlog, deleteBlog, getAllBlogs, getBlogById } from '../controller/blog.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Public (guest) routes — no authentication required.
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);

// Authenticated routes — ownership/admin checks happen inside the controllers.
router.post('/blogs/create', authenticate, createBlog);
router.put('/blogs/update/:id', authenticate, updateBlog);
router.delete('/blogs/:id', authenticate, deleteBlog);

export default router;
