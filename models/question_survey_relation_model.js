import { DataTypes } from 'sequelize';
import sequelize from './db.js';


const QuestionSurveyRelationModel = sequelize.define('Relation', {
  qsr_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  survey_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  question_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'question_survey_relations',
  timestamps: false 
});


export { QuestionSurveyRelationModel };