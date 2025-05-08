import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrls: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Post;
