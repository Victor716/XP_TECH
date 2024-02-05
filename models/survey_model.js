import { DataTypes } from 'sequelize';
import sequelize from './db.js';


const SurveyModel = sequelize.define('Survey', {
  survey_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question_nums: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  survey_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  survey_description: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'surveys',
  timestamps: false 
});


export { SurveyModel };