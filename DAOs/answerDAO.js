import { Op } from 'sequelize';

import { AnswerModel } from "../models/index.js";
import { getSurveyById } from "./surveyDAO.js";

async function pushAnswers(user_id, raw_answers, questions){
    const qsr_ids = questions.map(question => question.Relation.qsr_id);

    if (questions.length !== raw_answers.length) {
        throw new Error('Questions and answers arrays must be of the same length.');
    }
    try{ 
        const answers_to_save = qsr_ids.map((qsr_id, index) => ({
            qsr_id: qsr_id,
            user_id: user_id,
            value: raw_answers[index],
        }));
        await AnswerModel.bulkCreate(answers_to_save, {
            updateOnDuplicate: ['value']} )
        return true

    } catch (error){
        console.error('Failed to save answers:', error);
        return false
    }
}

async function getOneSurveyAnswers(user_id, survey_id,){
    try {
        const survey_questions = await getSurveyById(survey_id);
        if (!survey_questions) {
          console.log('No survey found with the given survey_id');
          return null;
        }
    
        const qsr_ids = survey_questions.map(question => question.Relation.qsr_id);
        const answers = await AnswerModel.findAll({
          where: {
            user_id: user_id,
            qsr_id: {
                [Op.in]: qsr_ids 
              }
          }
        });
    
        const userAnswers= answers.map(answer => answer.dataValues)
        const combinedArray = survey_questions.map(question => {
            const answer = userAnswers.find(ans => ans.qsr_id === question.Relation.qsr_id);
            if (answer) {
              return {
                question: question, 
                answer: answer
              };
            }
            return {
              question: question,
              answer: null 
            };
          });
        return combinedArray
        
      } catch (error) {
        console.error('Failed to get survey answers:', error);
        return null; 
      }
}


export { pushAnswers, getOneSurveyAnswers }