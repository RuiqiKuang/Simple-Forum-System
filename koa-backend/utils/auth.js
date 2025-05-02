import jwt from 'jsonwebtoken';
import User from '../models/user.js';
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

export async function validateUser(ctx, next) {
  const token = ctx.cookies.get('token');
  const payload = verifyToken(token);

  if (!payload) {
    ctx.status = 401;
    ctx.body = { success: false, message: 'Unauthorized' };
    return;
  }

  const user = await User.findByPk(payload.id);
  if (!user) {
    ctx.status = 401;
    ctx.body = { success: false, message: 'User not found' };
    return;
  }

  ctx.state.user = user;
  await next();
}