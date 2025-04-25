import User from '../models/user.js';
import { generateToken } from '../config/jwtUtils.js';
import { secretKey, tokenExpiration } from '../config/jwtConfig.js';

// Enhanced registration controller
export const signup = async (req, res) => {
    try {
        const { name, username, email, password, role } = req.body;

        // Validate required fields
        if (!name || !username || !email || !password || !role) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required'
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                message: existingUser.email === email 
                    ? 'Email already in use' 
                    : 'Username already taken'
            });
        }

        // Create new user
        const user = new User({ 
            name, 
            username, 
            email, 
            password, 
            role 
        });

        await user.save();

        // Generate token
        const token = generateToken(user);

        // Return response without password
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({ 
            success: true,
            message: 'User registered successfully',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Registration failed',
            error: error.message 
        });
    }
}

// Enhanced login controller
export const create_session = async (req, res) => {
    try {
        const { emailUsername, password } = req.body;

        if (!emailUsername || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email/username and password are required'
            });
        }

        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: emailUsername.trim().toLowerCase() },
                { username: emailUsername.trim() }
            ]
        }).select('+password');

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user);

        // Return response without password
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({ 
            success: true,
            message: 'Login successful',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Login failed',
            error: error.message 
        });
    }
}

// Profile controller remains the same
export const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, {
            name: 1, username: 1, email: 1, role: 1, contact: 1, address: 1, location: 1
        });
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({ 
            success: true,
            message: 'User profile retrieved',
            user
        });
    } catch (error) {
        console.error('Profile error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Failed to get profile',
            error: error.message 
        });
    }
}

// Update profile controller
export const update_profile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({ 
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Failed to update profile',
            error: error.message 
        });
    }
}