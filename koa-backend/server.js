import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import commentRoutes from './routes/comment.js'
import avatarRoutes from './routes/uploadAvatar.js'
import './models/associations.js';
const app = new Koa();
app.use(bodyParser());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
app.use(postRoutes.routes()).use(postRoutes.allowedMethods());
app.use(commentRoutes.routes()).use(commentRoutes.allowedMethods());
app.use(avatarRoutes.routes()).use(avatarRoutes.allowedMethods());

app.listen(3001, () => {
  console.log('✅ Server running on http://localhost:3001');
});
