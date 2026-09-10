import { Router } from 'express';
import { getUsers, getUserById, updateUserStatus, getProfile, updateProfile, updatePassword, updateProfileImage } from '../controller/users.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';
import { uploadProfileImage } from '../middleware/upload.middleware.js';

const router = Router();

/* After request first check if user is authenticated, then check if user is admin,
and only if both checks pass, execute the getUsers controller.*/

// Own-profile routes must be declared before '/users/:id' so Express doesn't
// match "profile" or "password" as the :id parameter.
router.get('/users/profile', authenticate, getProfile);
router.put('/users/profile/update', authenticate, updateProfile);
router.patch('/users/password', authenticate, updatePassword);
router.patch('/users/profile/image', authenticate, (req, res, next) => {
    uploadProfileImage.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Image upload failed' });
        }
        next();
    });
}, updateProfileImage);

router.get('/users', authenticate, authorizeAdmin, getUsers);
router.get('/users/:id', authenticate, authorizeAdmin, getUserById);
router.patch('/users/:id/status', authenticate, authorizeAdmin, updateUserStatus);

export default router;
