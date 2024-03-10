// test.js
import { AnswerModel } from '../models/answer_model.js';

async function testSymptomIdGetter() {
    try {
        // Create a test instance of AnswerModel
        const answer = await AnswerModel.create({
            qsr_id: 8, // Set a test qsr_id value
            user_id: 1, // Set a test user_id value
            option_id: 1, // Set a test option_id value
            value: 'Test value' // Set a test value for the value column
        });

        // Access the symptom_id property
        const symptomId = await answer.get('symptom_id');
        console.log("Symptom ID:", symptomId); // Print the retrieved symptom_id

        // *******************Uncomment the below two lines if you wish to delete the db entry after testing

        // await answer.destroy();
        // console.log("Test data entry deleted successfully.");


    } catch (error) {
        console.error("Error:", error);
    }
}

// Call the test function
testSymptomIdGetter();