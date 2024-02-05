import database from '../database.js'
// import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import { UserModel } from '../models/user_model.js';

// todo: add jwt sececrete key

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jsonwebtoken.verify(token, 'abcdefg', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // the log_in user
    console.log(user)
    next();
  });
}


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
      const db = await database.openUserDb();
      const user = await UserModel.findOne({ where: { user_id } });
      if (user) {
        const token = jsonwebtoken.sign({ user_id: user.user_id, wechatId: user.wechatId }, 'abcdefg', { expiresIn: '2h' });
        res.json({ message: "Signed in successfully", token , user});
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // get_usrer_score
  const get_my_score = async (req, res) => {
      const userId = req.user.userId
      const db = await database.openDb();
      const user = await db.get('SELECT testScore FROM users WHERE id = ?', [userId]);
      
      if (user) {
          res.json({ testScore: JSON.parse(user.testScore) });
      } else {
          res.status(404).json({ message: "User not found" });
      }
  }
  // add_user_score
  const add_test_result = async (req, res) => {
      const { testScore } = req.body;
      const userId = req.user.userId

      const db = await database.openDb();
      await db.run('UPDATE users SET testScore = ? WHERE id = ?', [JSON.stringify(testScore), userId]);
      res.json({ message: "Test score added" });
  }

  // request mapping paths
  app.post("/api/auth/sign_up", sign_up);
  app.post("/api/auth/sign_in", sign_in);

  app.get('/api/get_my_score/',authenticateToken, get_my_score)
  app.post('/api/add_test_result',authenticateToken, add_test_result)

}


export default AuthenticationController;