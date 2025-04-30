import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import './models/associations.js';
const app = new Koa();
app.use(bodyParser());

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type');
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200;
  } else {
    await next();
  }
});

app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
app.use(postRoutes.routes()).use(postRoutes.allowedMethods());

app.listen(3001, () => {
  console.log('✅ Server running on http://localhost:3001');
});
