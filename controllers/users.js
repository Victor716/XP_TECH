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
      console.log('error', error)
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

  const get_user_character = async(req, res) => {
    if (!req.session || !req.session.user_id){
      return res.status(401).json({ message: "Invalid credentials" });
    } 
    try{
      fist_question = "Fisrt question that LLM is going to ask";
      let finish = false
      const previous_ans = req.body;
      if (!previous_ans){
        return res.json({ message: fist_question, finish});
      }
      else{
        // send to llm
        const llm_return = await call_LLM(previous_ans); // TODO:
        if (llm_return.is_end){
          finish = true
          await UserModel.update({ user_character: llm_return },
            { where: 
              { user_id : req.session.user_id }
            }
          )
          return res.json({ message: "character diagnose complete", finish})
        }
        return res.json({ message: llm_return, finish});
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async function call_LLM() {
    //TODO
  }
  
  // request mapping paths
  app.post("/api/auth/sign_up", sign_up);
  app.post("/api/auth/sign_in", sign_in);

}


export default AuthenticationController;