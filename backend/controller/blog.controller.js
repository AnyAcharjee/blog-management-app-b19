import { Op } from 'sequelize';
import { Blog, User } from '../db.js';
import { isValidId } from '../utils/validators.js';

const formatBlog = (blog) => ({
    id: blog.id,
    blogTitle: blog.blogTitle,
    blog: blog.blog,
    category: blog.category,
    author: blog.User ? {
        id: blog.User.id,
        firstname: blog.User.firstName,
        lastname: blog.User.lastName,
        profileImage: blog.User.profileImage,
    } : null,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
});

export const createBlog = async (req, res) => {
    const { blogTitle, blog, category } = req.body;

    if (!blogTitle || !blogTitle.trim() || !blog || !blog.trim() || !category || !category.trim()) {
        return res.status(400).json({ message: 'blogTitle, blog and category are required' });
    }

    try {
        const newBlog = await Blog.create({
            userId: req.user.id,
            blogTitle,
            blog,
            category,
        });

        res.status(201).json({ blog: newBlog });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateBlog = async (req, res) => {
    const blogId = req.params.id;

    if (!isValidId(blogId)) {
        return res.status(400).json({ message: 'Invalid blog id' });
    }

    const { blogTitle, blog, category } = req.body;

    try {
        const existingBlog = await Blog.findByPk(blogId);
        if (!existingBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (existingBlog.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this blog.' });
        }

        if (blogTitle !== undefined) {
            if (!blogTitle.trim()) {
                return res.status(400).json({ message: 'blogTitle cannot be empty' });
            }
            existingBlog.blogTitle = blogTitle;
        }
        if (blog !== undefined) {
            if (!blog.trim()) {
                return res.status(400).json({ message: 'blog content cannot be empty' });
            }
            existingBlog.blog = blog;
        }
        if (category !== undefined) {
            if (!category.trim()) {
                return res.status(400).json({ message: 'category cannot be empty' });
            }
            existingBlog.category = category;
        }

        await existingBlog.save();
        res.status(200).json({ blog: existingBlog });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteBlog = async (req, res) => {
    const blogId = req.params.id;

    if (!isValidId(blogId)) {
        return res.status(400).json({ message: 'Invalid blog id' });
    }

    try {
        const existingBlog = await Blog.findByPk(blogId);
        if (!existingBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (existingBlog.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this blog.' });
        }

        await existingBlog.destroy();
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllBlogs = async (req, res) => {
    const { title, category } = req.query;

    const where = {};
    if (title) {
        where.blogTitle = { [Op.like]: `%${title}%` };
    }
    if (category) {
        where.category = category;
    }

    try {
        const blogs = await Blog.findAll({
            where,
            include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'profileImage'] }],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({ blogs: blogs.map(formatBlog) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBlogById = async (req, res) => {
    const blogId = req.params.id;

    if (!isValidId(blogId)) {
        return res.status(400).json({ message: 'Invalid blog id' });
    }

    try {
        const blog = await Blog.findByPk(blogId, {
            include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'profileImage'] }],
        });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json({ blog: formatBlog(blog) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
