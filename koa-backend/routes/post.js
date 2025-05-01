import Router from 'koa-router';
import { v4 as uuidv4 } from 'uuid';
import Post from '../models/post.js';
import User from '../models/user.js';
import Like from '../models/like.js';

const router = new Router();

async function validateUser(ctx, next) {
  const username = ctx.request.body.username;
  if (!username) {
    ctx.status = 401;
    ctx.body = { success: false, message: 'Username required' };
    return;
  }
  const user = await User.findOne({ where: { username } });
  if (!user) {
    ctx.status = 403;
    ctx.body = { success: false, message: 'Invalid user' };
    return;
  }
  ctx.state.user = user;
  await next();
}

// GET /posts (with likers)
router.get('/posts', async (ctx) => {
  const posts = await Post.findAll({
    include: [
      { model: User, attributes: ['username'] },
      { model: User, as: 'Likers', attributes: ['username'] }
    ],
    order: [['createdAt', 'DESC']]
  });

  ctx.body = {
    success: true,
    posts: posts.map(p => ({
      id: p.id,
      content: p.content,
      likes: p.Likers.length,
      username: p.User.username,
      likers: p.Likers.map(u => u.username)
    }))
  };
});

// POST /posts
router.post('/posts', validateUser, async (ctx) => {
  const { content } = ctx.request.body;
  const user = ctx.state.user;
  const post = await Post.create({
    id: uuidv4(),
    content,
    userId: user.id
  });
  ctx.body = { success: true, post };
});

// POST /posts/:id/like (toggle like/unlike)
router.post('/posts/:id/like', validateUser, async (ctx) => {
  const post = await Post.findByPk(ctx.params.id);
  const user = ctx.state.user;
  if (!post) {
    ctx.status = 404;
    ctx.body = { success: false, message: 'Post not found' };
    return;
  }
  const existing = await Like.findOne({ where: { userId: user.id, postId: post.id } });

  if (existing) {
    await existing.destroy();
    const likeCount = await Like.count({ where: { postId: post.id } });
    post.likes = likeCount;
    await post.save();
    ctx.body = { success: true, action: 'unliked', likes: likeCount };
  } else {
    await Like.create({ id: uuidv4(), userId: user.id, postId: post.id });
    const likeCount = await Like.count({ where: { postId: post.id } });
    post.likes = likeCount;
    await post.save();
    ctx.body = { success: true, action: 'liked', likes: likeCount };
  }
});

export default router;
