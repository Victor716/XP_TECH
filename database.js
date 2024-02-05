import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import sequelize from './models/db.js';
import * as models from './models/index.js';
import { questions_v1 } from './static_data/questions.js';
import { addSurveyIfEmpty } from './DAOs/surveyDAO.js';
import { importQuestionsIfEmpty } from './DAOs/questionDAO.js';
import { setupAssociations } from './models/index.js';

const { Database } = sqlite3;

const default_survey_name = 'Demo Survey';
const default_survey_description = 'This is a demo survey.';
const default_list_of_question_IDs = [1, 2, 3, 4, 5]

async function openUserDb() {
    return open({
      filename: 'users.db',
      driver: Database
    });
  }

async function initializeDatabase() {
  try {
    setupAssociations()
    // await sequelize.sync({force: true});
    await sequelize.sync(); // 创建或更新数据库表结构
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// async function importQuestionsIfEmpty(questions) {
//   try {
//     const count = await models.QuestionModel.count();
//     if (count === 0){
//       for (const description of questions) {
//         await models.QuestionModel.create({
//           question_discription: description,
//           question_type: 'simple_choice'
//         });
//       }
//     }
//     console.log('All questions have been successfully imported.');
//   } catch (error) {
//     console.error('Failed to import questions:', error);
//   }
// }

async function setup() {
  await initializeDatabase();
  await importQuestionsIfEmpty(questions_v1)
  await addSurveyIfEmpty(default_survey_name, 
    default_survey_description, default_list_of_question_IDs)
    .catch(console.error)
}

export default {
  openUserDb,
  setup
};