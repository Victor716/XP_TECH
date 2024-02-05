import { Sequelize, DataTypes } from 'sequelize';
import sequelize from './db.js';


const UserModel = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    // autoIncrement: true
  },
  wechat_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  org: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '大一'
  }
}, {
  tableName: 'users',
  timestamps: false 
});


export { UserModel };