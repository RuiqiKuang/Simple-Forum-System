import Router from 'koa-router';
import multer from '@koa/multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken, validateUser } from '../utils/auth.js';
import Post from '../models/post.js';
import User from '../models/user.js';
import Like from '../models/like.js';

import dotenv from 'dotenv';
dotenv.config();

const router = new Router();
const upload = multer();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// POST /posts - Multiple images upload
router.post('/posts', validateUser, upload.array('images', 9), async (ctx) => {
  const { content } = ctx.request.body;
  const user = ctx.state.user;
  const files = ctx.files || [];

  const imageUrls = await Promise.all(files.map(async (file) => {
    const fileExt = file.originalname.split('.').pop();
    const filename = `posts/${uuidv4()}.${fileExt}`;

    const uploadParams = {
      Bucket: process.env.POSTIMG_S3_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    await s3.send(new PutObjectCommand(uploadParams));

    return `https://${process.env.POSTIMG_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
  }));

  const post = await Post.create({
    id: uuidv4(),
    content,
    imageUrls,
    userId: user.id
  });

  ctx.body = { success: true, post };
});

// GET /posts (updated for multi-image support)
router.get('/posts', validateUser, async (ctx) => {
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
      imageUrls: p.imageUrls || [],
      likes: p.Likers.length,
      username: p.User.username,
      createdAt: p.createdAt,           
      likers: p.Likers.map(u => u.username)
    }))
  };
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

//auth
router.get('/me', async (ctx) => {
  try {
    const token = ctx.cookies.get('token');
    const payload = verifyToken(token);
    if (!payload) {
      ctx.status = 401;
      ctx.body = { success: false, message: 'Unauthorized' };
      return;
    }
    ctx.body = { success: true, username: payload.username };
  } catch (err) {
    console.error('JWT verify error:', err);
    ctx.status = 500;
    ctx.body = { success: false, message: 'Internal server error' };
  }
});


export default router;
