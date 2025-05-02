import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET;

export const createToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};
