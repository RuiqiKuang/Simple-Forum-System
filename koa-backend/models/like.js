import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postId: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Like;
