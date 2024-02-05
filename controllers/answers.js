import { Op } from 'sequelize';

import { pushAnswers, getOneSurveyAnswers } from "../DAOs/answerDAO.js"
import { AnswerModel } from "../models/answer_model.js";
import { getSurveyById } from "../DAOs/surveyDAO.js";


const answer_expired_month_length = 6;

const AnswerController = (app) => {

    const push_answers = async(req, res) =>{
        // console.log("in push_ansers")
        try{
            const {user_id, survey_id, raw_answers } = req.body;
            const survey_questions = await getSurveyById(survey_id);
            const qsr_ids = survey_questions.map(question => question.Relation.qsr_id);
            const existingAnswers = await AnswerModel.findAll({
                where: {
                    user_id: user_id,
                    qsr_id: {
                        [Op.in]: qsr_ids // qsr_id 必须在 qsr_ids 数组中的一个
                    }
                }
            }); 
            const now = new Date();
            const exprie_time = new Date(now.setMonth(now.getMonth() - answer_expired_month_length));
            const recentAnswer = existingAnswers.find(answer => answer.createdAt >= exprie_time);
            // console.log(user_id,survey_id,raw_answers, exprie_time,existingAnswers, recentAnswer)
            if (recentAnswer) {
                return res.status(409).json({ message: `Already answered on ${recentAnswer.createdAt}` });
            }
            else if (await pushAnswers(user_id, raw_answers, survey_questions)){
                return res.status(201).json({ message: 'answers successfully pushed' });
            }
            else{
                return res.status(500).json({ message: 'unknow error' });
            }
        }catch(error){
            console.log(error.message)
             return res.status(500).json({ error: 'Failed to push answers' });
        }
    }

    const get_one_survey_answers = async (req, res) => {
        const { user_id, survey_id } = req.params; 
        try {
          const surveyAnswers = await getOneSurveyAnswers(user_id, survey_id);
      
          if (surveyAnswers) {
            res.json(surveyAnswers); 
          } else {
            res.status(404).json({ message: 'Survey answers not found' }); 
          }
        } catch (error) {
          console.error('Error fetching survey answers:', error);
          res.status(500).json({ message: 'Internal server error' }); 
        }
      };

    app.post('/api/add_survey_result', push_answers);
    app.get('/survey/:user_id/:survey_id/answers', get_one_survey_answers);
}


export default AnswerController