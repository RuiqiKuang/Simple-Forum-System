import Router from 'koa-router';
import { v4 as uuidv4 } from 'uuid';
import Comment from '../models/comment.js';
import Post from '../models/post.js';
import User from '../models/user.js';
import { validateUser } from '../utils/auth.js';
const router = new Router();

router.post('/posts/:id/comments', validateUser, async (ctx) => {
  const postId = ctx.params.id;
  const { content } = ctx.request.body;
  const user = ctx.state.user;

  const post = await Post.findByPk(postId);
  if (!post) {
    ctx.status = 404;
    ctx.body = { success: false, message: 'Post not found' };
    return;
  }

  const comment = await Comment.create({
    id: uuidv4(),
    content,
    postId: postId,
    userId: user.id
  });

  ctx.body = { success: true, comment };
});

router.get('/posts/:id/comments', async (ctx) => {
  const postId = ctx.params.id;
  const comments = await Comment.findAll({
    where: { postId },
    include: { model: User, attributes: ['username'] },
    order: [['createdAt', 'ASC']]
  });

  ctx.body = {
    success: true,
    comments: comments.map(c => ({
      id: c.id,
      content: c.content,
      username: c.User.username,
      createdAt: c.createdAt
    }))
  };
});

export default router;
