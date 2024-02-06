import { SurveyModel, QuestionSurveyRelationModel, QuestionModel } from "../models/index.js";


async function addSurveyToDB(survey_name, survey_description, list_of_question_IDs) {
    try {
      const newSurvey = await SurveyModel.create({
        survey_name: survey_name,
        survey_description: survey_description,
        question_nums: list_of_question_IDs.length
      });
  
      console.log(`New survey created: ${survey_name}`);
  
      const relationPromises = list_of_question_IDs.map((question_id, index) => {
        return QuestionSurveyRelationModel.create({
          survey_id: newSurvey.survey_id,
          question_id: question_id,
          question_order: index + 1
        });
      });
  
      await Promise.all(relationPromises);
  
      console.log(`All question-survey relations for survey '${survey_name}' have been created.`);
    } catch (error) {
      console.error('Failed to add survey to DB:', error);
    }
  }

async function addSurveyIfEmpty(survey_name, survey_description, list_of_question_IDs) {
    try {
        // 检查 Survey 表是否为空
        const count = await SurveyModel.count();
        if (count === 0) {
            // 表为空，调用 addSurveyToDB 添加调查
            await addSurveyToDB(survey_name, survey_description, list_of_question_IDs);
            console.log('Survey added because the table was empty.');
        } else {
            console.log('Survey table is not empty. No action taken.');
        }
    } catch (error) {
        console.error('Error checking if survey table is empty or adding survey:', error);
    }
}

async function getSurveyById(id){
    try {
        const surveyWithQuestions = await SurveyModel.findByPk(id, {
            include: [{
              model: QuestionModel,
              as: 'Questions' 
            }]
          });
        // console.log(surveyWithQuestions.Questions);
          const questions = surveyWithQuestions.Questions.map(question => question.dataValues).sort((a, b) => {
            return a.Relation.question_order - b.Relation.question_order;
        });
        return questions;
    } catch (error) {
        console.error('Failed to fetch questions for survey from DB:', error);
        return null;
    }
}

  export { addSurveyToDB, addSurveyIfEmpty, getSurveyById};