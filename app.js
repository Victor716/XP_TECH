import express from "express";
import dotenv from 'dotenv'
import bodyParser from 'body-parser';

import AuthenticationController from "./controllers/users.js"
import SurveyController from "./controllers/surveys.js";
import AnswerController from "./controllers/answers.js";
import database from "./database.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({
  limit: '50mb'
}));


AuthenticationController(app)
SurveyController(app)
AnswerController(app)

const PORT = process.env.PORT || 3000;

// TODO:
// DB might hosted in other instance?

database.setup().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error("Failed to set up database:", error);
});

