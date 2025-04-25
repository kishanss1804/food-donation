import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import donorRouter from './donor.js';
import agencyRouter from './agency.js';
import ngoRouter from './ngo.js';
import * as controller from '../controller/index.js';
import { authenticateToken } from '../config/authMiddleware.js';

dotenv.config();
const router = express.Router();

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowedHeaders: ['Authorization', 'Content-Type', 'Role'],
    credentials: true // This enables cookies/authentication headers
};
  
router.use(cors(corsOptions));

// Add global error handler
router.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Add request logging middleware
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

router.get('/', (req, res) => {
  return res.json('Hello!');
});

router.use('/donor', donorRouter);
router.use('/agency', agencyRouter);
router.use('/ngo', ngoRouter);

// Auth routes with try/catch blocks
router.post('/signup', async (req, res) => {
  try {
    await controller.signup(req, res);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

router.post('/create-session', async (req, res) => {
  try {
    await controller.create_session(req, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    await controller.profile(req, res);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: 'Could not fetch profile', error: error.message });
  }
});

router.post('/update-profile', authenticateToken, async (req, res) => {
  try {
    await controller.update_profile(req, res);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: 'Could not update profile', error: error.message });
  }
});

router.get('/getTomTomApiKey', authenticateToken, (req, res) => {
  try {
    return res.status(200).json({ message: 'Api key sent successfully!', apiKey: process.env.apiKey });
  } catch (error) {
    console.error("API key error:", error);
    res.status(500).json({ message: 'Could not get API key', error: error.message });
  }
});

// Uncomment and implement logout if needed
// router.post('/logout', controller.logout);

export default router;