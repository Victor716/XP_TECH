import { QuestionSurveyRelationModel, QuestionModel, SurveyModel } from "../models/index.js";
import { getSurveyById } from "../DAOs/surveyDAO.js";

const SurveyController = (app) => {

    const get_survey_by_id = async (req, res) => { 
        try{
            let { survey_id } = req.body;
            if (!survey_id) {
                survey_id = 1;
            }
            const questions = await getSurveyById(survey_id)
            // console.log(questions)
            if (!questions) {
                res.status(404).json({ error: `No survey: ${survey_id}` })
            }
            else{
                res.json({survey_id, questions});
            }
        } catch (error) {
            console.error('Failed to fetch questions for survey:', error);
            res.status(500).json({ error: 'Failed to fetch questions for the survey' });
        }
    }

    app.get('/api/get_survey_by_id', get_survey_by_id)

}

export default SurveyController