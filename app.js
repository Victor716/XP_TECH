import express from "express";
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import Expressws from 'express-ws'

import AuthenticationController from "./controllers/users.js";
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

const wsServer = Expressws(app);
AuthenticationController(app)
SurveyController(app)
AnswerController(app)

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

app.post('/test', function(req, res) {

  console.log('test', req.body.msg);
});

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

