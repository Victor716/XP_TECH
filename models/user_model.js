import { Sequelize, DataTypes } from 'sequelize';
import sequelize from './db.js';


const UserModel = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  school: {
    type: DataTypes.STRING,
    allowNull: true
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  major: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  character: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'users',
  timestamps: false 
});


export { UserModel };