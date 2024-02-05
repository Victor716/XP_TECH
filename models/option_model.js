import { DataTypes } from 'sequelize';
import sequelize from './db.js';


const OptionModel = sequelize.define('Option', {
  option_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  survey_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  option_value: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'options',
  timestamps: false 
});

export { OptionModel };