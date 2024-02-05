import { QuestionModel } from "../models/question_model.js";


async function importQuestionsIfEmpty(questions) {
    try {
      const count = await QuestionModel.count();
      if (count === 0){
        for (const description of questions) {
          await QuestionModel.create({
            question_discription: description,
            question_type: 'simple_choice'
          });
        }
      }
      console.log('All questions have been successfully imported.');
    } catch (error) {
      console.error('Failed to import questions:', error);
    }
  }

export {importQuestionsIfEmpty}