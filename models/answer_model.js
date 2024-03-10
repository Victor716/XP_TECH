import { DataTypes } from 'sequelize';
import sequelize from './db.js';


const AnswerModel = sequelize.define('Answer', {
  answer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  qsr_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  option_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'answers',
  timestamps: true,
  indexes: [{
    unique: true,
    fields: ['qsr_id', 'user_id']
  }]
});


export { AnswerModel };