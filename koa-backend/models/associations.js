import User from './user.js';
import Post from './post.js';
import Like from './like.js';
import Comment from './comment.js';
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Post, { through: Like, as: 'LikedPosts', foreignKey: 'userId' });
Post.belongsToMany(User, { through: Like, as: 'Likers', foreignKey: 'postId' });

await User.sync();
await Post.sync();
await Like.sync();
await Comment.sync();

export { User, Post, Like, Comment };
