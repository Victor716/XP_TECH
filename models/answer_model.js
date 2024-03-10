import { DataTypes } from 'sequelize';
import sequelize from './db.js';
import { SymptomModel } from './symptom_model.js';


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
  },
  symptom_id: {
    type: DataTypes.INTEGER, // Assuming symptom_id is of type INTEGER
    allowNull: true
  }
}, {
  tableName: 'answers',
  timestamps: true,
  indexes: [{
    unique: true,
    fields: ['qsr_id', 'user_id']
  }],
  hooks: {
    beforeSave: async (instance, options) => {
      const qsrIdStr = String(instance.qsr_id);
      const symptom = await SymptomModel.findOne({
        where: sequelize.where(sequelize.fn('INSTR', sequelize.col('qsr_id'), qsrIdStr), '>', 0)
      });
      if (symptom) {
        instance.symptom_id = symptom.symptom_id;
      } else {
        instance.symptom_id = null;
      }
    }
  }
});


export { AnswerModel };