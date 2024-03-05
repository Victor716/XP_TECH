import axios from 'axios'
import CircularJSON from "circular-json";
import database from '../database.js'
import { UserModel } from '../models/user_model.js';

const AuthenticationController = (app) => {
  //sign up
  const sign_up = async (req, res) => {
    const { user_id, wechat_id, first_name, last_name, birthday, org, student_id, grade } = req.body;
    // console.log(wechatId, first_name, last_name, birthday, org, student_id, grade);
    try {
      await UserModel.create({ user_id, wechat_id, first_name, last_name, birthday, org, student_id, grade });
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

  const get_open_id = async (req, res) => {
    try {
      const { login_code: js_code } = req.body;
      const appid = "wxb5503b722d9b9be6";
      const secret = "20f6f0e3cd4cb7478ad996371d07efd7"
      const jscode2sessionUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`;

      const response = await axios.get(jscode2sessionUrl);
      const { data: { errcode, errmsg, session_key, openid } } = response;
      if (!errcode) {
        console.log(session_key, openid);
        res.json({ message: "Get open data successfully", data: response.data });
      } else {
        res.status(401).json({ message: errmsg });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const get_user_character = async (req, res) => {
    if (!req.session || !req.session.user_id) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    try {
      fist_question = "Fisrt question that LLM is going to ask";
      let finish = false
      const previous_ans = req.body;
      if (!previous_ans) {
        return res.json({ message: fist_question, finish });
      }
      else {
        // send to llm
        const llm_return = await call_LLM(previous_ans); // TODO:
        if (llm_return.is_end) {
          finish = true
          await UserModel.update({ user_character: llm_return },
            {
              where:
                { user_id: req.session.user_id }
            }
          )
          return res.json({ message: "character diagnose complete", finish })
        }
        return res.json({ message: llm_return, finish });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async function call_LLM() {
    //TODO
  }

  const getAuthToken = async (req, res) => {
    try {
      const appid = "wxb5503b722d9b9be6";
      const secret = "20f6f0e3cd4cb7478ad996371d07efd7"
      const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
      const reponse = await axios.get(url);
      const { data: { errcode, errmsg, session_key, openid } } = response;
      if (!errcode) {
        console.log(session_key, openid);
        res.json({ message: "Get open data successfully", data: response.data });
      } else {
        res.status(401).json({ message: errmsg });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // request mapping paths
  app.post("/api/auth/sign_up", sign_up);
  app.post("/api/auth/sign_in", sign_in);
  app.post("/api/auth/open_id", get_open_id);
}


export default AuthenticationController;