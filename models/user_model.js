import { Sequelize, DataTypes } from 'sequelize';
import sequelize from './db.js';


const UserModel = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    // autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: true
  },
  org: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '大一'
  }
}, {
  tableName: 'users',
  timestamps: false 
});


export { UserModel };