import fs from 'fs';
import path from 'path';
import { User } from '../db.js';
import { isValidPassword, isValidId, MIN_PASSWORD_LENGTH } from '../utils/validators.js';

export const getProfile = (req, res) => {
    User.findByPk(req.user.id, { attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] } })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.status(200).json({
                user: user
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
};

export const updateProfile = (req, res) => {
    const { firstname, lastname } = req.body;

    // Only firstName/lastName are ever written here, so role and isActive
    // can never be changed through this endpoint even if sent in the body.
    const updates = {};
    if (firstname !== undefined) updates.firstName = firstname;
    if (lastname !== undefined) updates.lastName = lastname;

    User.findByPk(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            Object.assign(user, updates);
            return user.save().then(() => {
                const { password, resetPasswordToken, resetPasswordExpires, ...userWithoutPassword } = user.toJSON();
                res.status(200).json({
                    user: userWithoutPassword
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
};

export const updatePassword = (req, res) => {
    const { password } = req.body;

    if (!isValidPassword(password)) {
        return res.status(400).json({
            message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
        });
    }

    User.findByPk(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            user.password = password;
            return user.save().then(() => {
                res.status(200).json({
                    message: 'Password updated successfully'
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
};

export const updateProfileImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'An image file is required' });
    }

    User.findByPk(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            const previousImage = user.profileImage;
            user.profileImage = `/uploads/avatars/${req.file.filename}`;

            return user.save().then(() => {
                if (previousImage && previousImage.startsWith('/uploads/avatars/')) {
                    const previousPath = path.join(process.cwd(), previousImage);
                    fs.unlink(previousPath, () => {});
                }

                const { password, resetPasswordToken, resetPasswordExpires, ...userWithoutPassword } = user.toJSON();
                res.status(200).json({
                    user: userWithoutPassword
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
};

export const getUsers = (req, res) => {
    User.findAll({ attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] } })
        .then(users => {
            res.status(200).json({
                users: users
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
};

export const getUserById = (req, res) => {

    const userId = req.params.id;

    if (!isValidId(userId)) {
        return res.status(400).json({ message: 'Invalid user id' });
    }

    User.findByPk(userId, { attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] } })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.status(200).json({
                user: user
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
};

export const updateUserStatus = (req, res) => {
    const userId = req.params.id;
    const { isActive } = req.body;

    if (!isValidId(userId)) {
        return res.status(400).json({ message: 'Invalid user id' });
    }

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({
            message: 'isActive must be a boolean'
        });
    }

    User.findByPk(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            user.isActive = isActive;
            return user.save().then(() => {
                /*It uses object destructuring and the rest operator to remove 
                  the password property from the user object and 
                  store all the remaining properties in userWithoutPassword
                */
                const { password, resetPasswordToken, resetPasswordExpires, ...userWithoutPassword } = user.toJSON();
                res.status(200).json({
                    user: userWithoutPassword
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
};
