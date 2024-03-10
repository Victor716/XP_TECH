import { UserModel } from "./user_model.js";
import { SymptomModel } from "./symptom_model.js";
import { OptionModel } from "./option_model.js";
import { QuestionModel } from "./question_model.js";
import { QuestionSurveyRelationModel} from "./question_survey_relation_model.js"
import { SurveyModel } from "./survey_model.js";
import { AnswerModel } from "./answer_model.js";

const setupAssociations = () => {
    QuestionModel.belongsToMany(SurveyModel, {
        through: QuestionSurveyRelationModel,
        foreignKey: 'question_id', // Relation 模型中关联到 Question 的外键
        otherKey: 'survey_id', // Relation 模型中关联到 Survey 的外键
        as: 'questions'
    });

    SurveyModel.belongsToMany(QuestionModel, {
        through: QuestionSurveyRelationModel,
        foreignKey: 'survey_id', // Relation 模型中关联到 Survey 的外键
        otherKey: 'question_id' // Relation 模型中关联到 Question 的外键
    });

    UserModel.hasMany(AnswerModel, {foreignKey: 'user_id', otherKey: 'user_id'});

    QuestionSurveyRelationModel.hasMany(AnswerModel), {foreignKey: 'qsr_id', otherKey: 'qsr_id'};

    // console.log("association setup complete")
}

export {OptionModel, SymptomModel, QuestionModel, QuestionSurveyRelationModel,
UserModel, SurveyModel, AnswerModel, setupAssociations}