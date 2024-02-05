import { DataTypes } from 'sequelize';
import sequelize from './db.js';


const QuestionModel = sequelize.define('Question', {
  question_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question_discription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  question_type: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'questions',
  timestamps: false 
});


export { QuestionModel };