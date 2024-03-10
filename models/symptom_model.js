import { DataTypes } from 'sequelize';
import sequelize from './db.js';


const SymptomModel = sequelize.define('Symptom', {
  symptom_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  qsr_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  symptom_value: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'symptoms',
  timestamps: false 
});

export { SymptomModel };