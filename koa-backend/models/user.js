import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import { v1 as uuidv1 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => uuidv1()
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: process.env.DEFAULT_AVATAR_URL
  }
});

export default User;
