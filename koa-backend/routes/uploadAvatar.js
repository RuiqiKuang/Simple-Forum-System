import Router from 'koa-router';
import multer from '@koa/multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../utils/auth.js';
import User from '../models/user.js';
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

router.post('/upload-avatar', upload.single('avatar'), async (ctx) => {
    try {
      const token = ctx.cookies.get('token');
      const userData = verifyToken(token);
      if (!userData) {
        ctx.status = 401;
        ctx.body = { success: false, message: 'Unauthorized' };
        return;
      }
  
      const file = ctx.file;
      if (!file) {
        ctx.status = 400;
        ctx.body = { success: false, message: 'No file uploaded' };
        return;
      }
  
      const fileExt = file.originalname.split('.').pop();
      const filename = `avatars/${uuidv4()}.${fileExt}`;
  
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype
      };
  
      await s3.send(new PutObjectCommand(uploadParams));
  
      const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

      const user = await User.findByPk(userData.id);
      if (!user) {
        ctx.status = 404;
        ctx.body = { success: false, message: 'User not found' };
        return;
      }
      user.avatar = imageUrl;
      await user.save();
  
      ctx.body = {
        success: true,
        imageUrl
      };
    } catch (err) {
      console.error('S3 upload error:', err);
      ctx.status = 500;
      ctx.body = { success: false, message: 'Failed to upload avatar' };
    }
  });

export default router;
