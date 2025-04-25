import dotenv from 'dotenv';
dotenv.config();

// Use environment variable for secret key
export const secretKey = process.env.JWT_SECRET || 'your-fallback-secret-key';

// Token expiration times
export const tokenExpiration = {
  accessToken: '1h',
  refreshToken: '7d'
};