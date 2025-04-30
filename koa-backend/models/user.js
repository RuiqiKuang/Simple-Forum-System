import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import { v1 as uuidv1 } from 'uuid';

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
  }
});

export default User;
