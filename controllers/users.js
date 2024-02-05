import database from '../database.js'
import { UserModel } from '../models/user_model.js';


const AuthenticationController = (app) => {

  //sign up
  const sign_up = async (req, res) => {
    const { user_id, wechat_id, first_name, last_name, birthday, org, student_id, grade } = req.body;
    // console.log(wechatId, first_name, last_name, birthday, org, student_id, grade);
    try {
      await UserModel.create({user_id, wechat_id, first_name, last_name, birthday, org, student_id, grade });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  //sign in
  const sign_in = async (req, res) => {
    try {
      const { user_id } = req.body;
      const user = await UserModel.findOne({ where: { user_id } });
      if (user) {
        // 在 session 中保存用户信息
        req.session.user_id = user.user_id; 
        req.session.wechat_id = user.wechat_id; 
        res.json({ message: "Signed in successfully", user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // request mapping paths
  app.post("/api/auth/sign_up", sign_up);
  app.post("/api/auth/sign_in", sign_in);

}


export default AuthenticationController;