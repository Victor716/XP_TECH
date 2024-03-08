import axios from 'axios'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

// import CircularJSON from "circular-json";
import database from '../database.js'
import { UserModel } from '../models/user_model.js'


function hashUserId(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('Missing JWT'));
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded.user_id); // 假设 JWT 中存储的用户 ID 字段名为 user_id
        }
      });
    }
  });
};

const AuthenticationController = (app) => {

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
        const token = jwt.sign({user_id: user_id}, process.env.JWT_SECRET, { expiresIn: '1h' }); // 生成 JWT
        // 新用户， 加入表格
        if (user === null) {
          try {
            await UserModel.create({ user_id});
            res.status(201).json({ message: 'New user registered successfully',  is_new_user: true, jwt: token });
          } catch (error) {
            res.status(500).json({ error: 'Failed to register user' });
          }
        } else {
          // 老用户， 返回 user_info
          const {user_id, ...user_data } = user.toJSON();
          res.status(200).json({ message: "Signed in successfully", is_new_user: false, user_data: user_data, jwt: token })
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
    try {
      const user_id = await verifyJWT(req.body.jwt);
      const {name, gender, school, grade, student_id, major } = req.body;
      const user = await UserModel.findByPk(user_id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const [affectedCount, affectedRows] = await UserModel.update({ name, gender, school, grade, student_id, major }, {
        where: { user_id: user_id }
      });
  
      return res.status(200).json({ message: `Updated successfully: count: ${affectedCount}`, jwt: req.body.jwt });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  };

  const get_user_info = async (req, res) => {
    try {
      const user_id = await verifyJWT(req.body.jwt);
      const user = await UserModel.findByPk(user_id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { user_id: id, ...user_data } = user.toJSON();
      return res.status(200).json({ message: 'User info:', user_data, jwt: req.body.jwt });
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  const get_user_character = async (req, res) => {
    if (!req.session || !req.session.user_id) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    try {
      const user = await UserModel.findOne({ where: { user_id } })
      if (user.user_character){
        return res.json({ message: 'previous_character_found', user_character: user.user_character });
      }
      else{
        let finish = false
        // 首次和LLM的通信会传递 user_id： user_id
        const { answers: previous_ans = { user_id: req.session.user_id } } = req.body;
        console.log(previous_ans); 
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
        return res.json({ message: "continue diagnosing", question: llm_return, finish });
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
  app.post("/api/auth/get_user_info", get_user_info);
  
}


export default AuthenticationController;