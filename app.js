import express from "express";
import session from 'express-session'
import dotenv from 'dotenv'

import AuthenticationController from "./controllers/users.js"
import SurveyController from "./controllers/surveys.js";
import AnswerController from "./controllers/answers.js";
import database from "./database.js";

dotenv.config();
const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, // 强制保存 session 即使它没有变化
  saveUninitialized: false, // 强制将未初始化的 session 存储
  cookie: {
    secure: false, // 在生产环境中应设置为 true
    maxAge: 100*60*60 // 设置 cookie 过期时间为 1 小时
  }
}));
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

