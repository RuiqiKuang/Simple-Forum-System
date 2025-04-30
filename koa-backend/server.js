import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import userRoutes from './routes/user.js';

const app = new Koa();

app.use(bodyParser());

// CORS 设置
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type');
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200;
  } else {
    await next();
  }
});

// 路由加载
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());

app.listen(3001, () => {
  console.log('✅ Server running on http://localhost:3001');
});
