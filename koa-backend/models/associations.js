import User from './user.js';
import Post from './post.js';

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

await User.sync();
await Post.sync();
export { User, Post };
