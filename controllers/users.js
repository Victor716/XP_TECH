import axios from 'axios'
import crypto from 'crypto'

// import CircularJSON from "circular-json";
import database from '../database.js'
import { UserModel } from '../models/user_model.js';


function hashUserId(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const AuthenticationController = (app) => {
//   //sign up
//   const sign_up = async (req, res) => {
//     const { user_id, first_name, last_name, birthday, org, student_id, grade } = req.body;
//     // console.log(user_id, first_name, last_name, birthday, org, student_id, grade);
//     try {
//       await UserModel.update({ user_id, first_name, last_name, birthday, org, student_id, grade });
//       res.status(200).json({ message: 'User registered successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to register user' });
//     }
//   }

//   //sign in
//   const sign_in = async (req, res) => {
//     try {
//       const { user_id } = req.body;
//       const user = await UserModel.findOne({ where: { user_id } });
//       if (user) {
//         // 在 session 中保存用户信息
//         req.session.user_id = user.user_id;
//         // req.session.wechat_id = user.wechat_id;
//         res.json({ message: "Signed in successfully", user });
//       } else {
//         res.status(401).json({ message: "Invalid credentials" });
//       }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

  const get_open_id = async (req, res) => {
    try {
      const { login_code: js_code } = req.body;
      const appid = process.env.APP_ID
      const secret = process.env.APP_SERECT
      const jscode2sessionUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`;

      const response = await axios.get(jscode2sessionUrl);
      const { data: { errcode, errmsg, session_key, openid } } = response;
      
      if (!errcode) {
        const user_id = hashUserId(openid)
        const user = await UserModel.findOne({ where: { user_id } })
        // 新用户， 加入表格
        if (user === null) {
          try {
            await UserModel.create({ user_id});
            req.session.user_id = user_id;
            res.status(201).json({ message: 'New user registered successfully',  is_new_user: true });
          } catch (error) {
            res.status(500).json({ error: 'Failed to register user' });
          }
        } else {
          req.session.user_id = user.user_id;
          // 老用户， 返回 user_info
          const {user_id, ...user_data } = user.toJSON();
          res.status(200).json({ message: "Signed in successfully", is_new_user: false, user_data: user_data })
        }
      } else {
        res.status(401).json({ message: errmsg });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 更新用户信息
  const update_user_info = async (req, res) => {
    const { user_id, first_name, last_name, birthday, org, student_id, grade } = req.body;
    try {
      const user = await UserModel.findByPk(user_id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await UserModel.update({ first_name, last_name, birthday, org, student_id, grade }, {
        where: { user_id: user_id }
      });
  
      res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update user information' });
    }
  };

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


  // request mapping paths
  // app.post("/api/auth/sign_up", sign_up);
  // app.post("/api/auth/sign_in", sign_in);
  app.post("/api/auth/open_id", get_open_id);
  app.patch("/api/auth/update_user_info", update_user_info);
  
}


export default AuthenticationController;