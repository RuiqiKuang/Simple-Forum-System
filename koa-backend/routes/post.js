// routes/post.js (Koa Backend)
import Router from 'koa-router';
import { v4 as uuidv4 } from 'uuid';
import Post from '../models/post.js';
import User from '../models/user.js';

const router = new Router();

// Middleware to validate user identity via username
async function validateUser(ctx, next) {
  const username = ctx.request.body.username;
  if (!username) {
    ctx.status = 401;
    ctx.body = { success: false, message: 'Username required for this action' };
    return;
  }
  const user = await User.findOne({ where: { username } });
  if (!user) {
    ctx.status = 403;
    ctx.body = { success: false, message: 'Invalid user' };
    return;
  }
  ctx.state.user = user; // store user in context for downstream access
  await next();
}

// GET /posts
router.get('/posts', async ctx => {
  const posts = await Post.findAll({
    include: { model: User, attributes: ['username'] },
    order: [['createdAt', 'DESC']]
  });
  ctx.body = {
    success: true,
    posts: posts.map(p => ({
      id: p.id,
      content: p.content,
      likes: p.likes,
      username: p.User.username
    }))
  };
});

// POST /posts
router.post('/posts', validateUser, async ctx => {
  const { content } = ctx.request.body;
  const user = ctx.state.user;
  const post = await Post.create({
    id: uuidv4(),
    content,
    userId: user.id,
    likes: 0
  });
  ctx.body = { success: true, post };
});

// POST /posts/:id/like
router.post('/posts/:id/like', async ctx => {
  const post = await Post.findByPk(ctx.params.id);
  if (!post) {
    ctx.status = 404;
    ctx.body = { success: false, message: 'Post not found' };
    return;
  }
  post.likes++;
  await post.save();
  ctx.body = { success: true, likes: post.likes };
});

export default router;
