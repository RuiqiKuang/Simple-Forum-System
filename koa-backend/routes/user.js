import Router from 'koa-router';
import bcrypt from 'bcryptjs';

import User from '../models/user.js';
import { createToken } from '../utils/auth.js';

const router = new Router();

// POST /registry
router.post('/registry', async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { success: false, message: 'Username and password cannot be empty.' };
    return;
  }

  const existing = await User.findOne({ where: { username } });
  if (existing) {
    ctx.status = 400;
    ctx.body = { success: false, message: 'Username already exists.' };
    return;
  }
  
  if (!/^[a-zA-Z0-9_]{4,20}$/.test(username)) {
    ctx.status = 400;
    ctx.body = { success: false, message: 'Username must be 4-20 characters long and contain only letters, numbers, or underscores.' };
    return;
  }
  
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
    ctx.status = 400;
    ctx.body = { success: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.' };
    return;
  }
  
  const hashed = await bcrypt.hash(password, 10);
  await User.create({
    username,
    password: hashed
  });

  ctx.body = { success: true, message: 'Registration successful.' };
});

// POST /login
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;

  const user = await User.findOne({ where: { username } });
  const valid = user && await bcrypt.compare(password, user.password);

  if (valid) {
    const token = createToken({ id: user.id, username: user.username });
    ctx.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });
    ctx.body = { success: true, username: user.username };
  } else {
    ctx.status = 401;
    ctx.body = { success: false, message: 'Invalid username or password.' };
  }
});

// GET /users
router.get('/users', async (ctx) => {
  const users = await User.findAll();
  ctx.body = { success: true, users: users.map(u => u.username) };
});

//Logout
router.post('/logout', async (ctx) => {
  ctx.cookies.set('token', '', {
    httpOnly: true,
    maxAge: 0,
    sameSite: 'lax'
  });
  ctx.body = { success: true, message: 'Logged out' };
});


export default router;
