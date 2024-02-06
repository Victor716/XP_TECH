import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import sequelize from './models/db.js';
import * as models from './models/index.js';
import { addSurveyIfEmpty } from './DAOs/surveyDAO.js';
import { importQuestionsIfEmpty } from './DAOs/questionDAO.js';
import { setupAssociations } from './models/index.js';

import { questions_v1 } from './static_data/questions.js';

const { Database } = sqlite3;

const default_survey_name =`default survey`
const default_survey_description =  `default survey for every new user.`
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
    if (process.env.FORCE_REBOOT_DB === 'yes'){
      await sequelize.sync({force: true})
      console.log('Database force rebot successfully.');
    }else{
      await sequelize.sync({force: false});
      console.log('Database initialized successfully.');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

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