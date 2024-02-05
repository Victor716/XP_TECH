import { QuestionSurveyRelationModel, QuestionModel, SurveyModel } from "../models/index.js";
import { getSurveyById } from "../DAOs/surveyDAO.js";

const SurveyController = (app) => {

    const get_survey_by_id = async (req, res) => {
        const { survey_id } = req.params;
        try{
            const questions = await getSurveyById(survey_id)
            console.log(questions)
            res.json({
                survey_id,
                questions
                });
        } catch (error) {
            console.error('Failed to fetch questions for survey:', error);
            res.status(500).json({ error: 'Failed to fetch questions for the survey' });
        }
    }

    app.get('/api/surveys/:survey_id/questions', get_survey_by_id)

}

export default SurveyController