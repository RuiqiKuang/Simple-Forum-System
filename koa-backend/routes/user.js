import Router from 'koa-router';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const router = new Router();

// POST /registry
router.post('/registry', async (ctx) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { success: false, message: '用户名和密码不能为空' };
    return;
  }

  const existing = await User.findOne({ where: { username } });
  if (existing) {
    ctx.status = 400;
    ctx.body = { success: false, message: '用户名已存在' };
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed });

  ctx.body = { success: true, message: '注册成功' };
});

// POST /login
router.post('/login', async ctx => {
  const { username, password } = ctx.request.body;

  const user = await User.findOne({ where: { username } });
  const valid = user && await bcrypt.compare(password, user.password);

  if (valid) {
    ctx.body = { success: true, username: user.username };
  } else {
    ctx.status = 401;
    ctx.body = { success: false, message: '账号或密码错误' };
  }
});

// GET /users
router.get('/users', async ctx => {
  const users = await User.findAll();
  ctx.body = { success: true, users: users.map(u => u.username) };
});

export default router;
