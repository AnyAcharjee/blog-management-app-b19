import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../db.js';
import { isValidEmail, isValidPassword, MIN_PASSWORD_LENGTH } from '../utils/validators.js';

export const register = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !firstname.trim() || !lastname || !lastname.trim() || !email || !password) {
        return res.status(400).json({ message: 'firstname, lastname, email and password are required' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        // role and isActive are always forced here, ignoring any value sent in the request body,
        // so a user can never self-assign the admin role or pre-activate/deactivate their account.
        const user = await User.create({
            firstName: firstname,
            lastName: lastname,
            email,
            password,
            role: 'user',
            isActive: true,
        });

        const { password: _password, ...userWithoutPassword } = user.toJSON();
        res.status(201).json({ user: userWithoutPassword });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Email is already registered' });
        }
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }
        //Password verify  
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        /* Create a JWT token with the user's id, email, and role as payload. 
        The token is signed using a secret key (JWT_SECRET) from the environment variables 
        and has an expiration time defined in the environment variables or 
        defaults to 1 day. */
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                profileImage: user.profileImage,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Always respond with the same generic message, whether or not the email
    // is registered, so this endpoint can't be used to enumerate accounts.
    const genericResponse = {
        message: 'If an account with that email exists, a password reset link has been sent.',
    };

    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
            await user.save();

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            console.log(`Password reset link for ${email}: ${frontendUrl}/reset-password/${token}`);
        }

        res.status(200).json(genericResponse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!isValidPassword(password)) {
        return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` });
    }

    try {
        const user = await User.findOne({ where: { resetPasswordToken: token } });

        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password successfully changed.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
