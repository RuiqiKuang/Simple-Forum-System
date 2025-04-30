import { DataTypes } from 'sequelize';
import { v1 as uuidv1 } from 'uuid';
import sequelize from '../db.js';

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


await User.sync();
export default User;
