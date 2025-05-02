import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './user.js';
import Post from './post.js';

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

export default Comment;
