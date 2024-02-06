# 如何运行（maybe？）：
 - 确保你的开发环境中已经安装了 Node.js。可以通过运行 node -v 在命令行中查看 Node.js 是否已安装以及安装的版本。
 - npm install 安装依赖
 - 在根目录下创建 .env, 加入：
```
NODE_ENV = 'local_test'
SESSION_SECRET = '' // 请设置一个密钥
FORCE_REBOOT_DB = 'no'
```
 - npm start 运行服务器

# 接口：

## user：

### app.post("/api/auth/sign_up", sign_up); 注册 用户个人信息

例：body
```json
{
  "user_id": "12345",
  "wechat_id": "qwert",
  "first_name": "John3",
  "last_name": "Doe3",
  "birthday": "1993-12-01",
  "org": "North Carolina State University",
  "student_id": "1234567",
  "grade": "大二"
}
```
return：
```json
{"message":"User registered successfully"}
```
### app.post("/api/auth/sign_in", sign_in); 登陆，获取session cookie

例：body
```json
{
  {
  "user_id": 12345
}
}
```
return：
```json
{
    "message": "Signed in successfully",
    "user": {
        "user_id": 12345,
        "wechat_id": "qwert",
        "first_name": "John3",
        "last_name": "Doe3",
        "birthday": "1993-12-01T00:00:00.000Z",
        "org": "North Carolina State University",
        "student_id": "1234567",
        "grade": "大二"
    }
}
```
## answers：

### app.post('/api/add_my_survey_result', push_answers) 记录该用户对某套survey的答案（需要session）。

答案长度需要与survey 长度相等，顺序相同，6个月内只能重复答同一套题一次。

例：body
```json
{
  {
  "user_id": "12345",
  "survey_id": 1,
  "raw_answers":["A",
  "B",
  "C",
  "D",
  "F"
  ]
}
}
```
return：
```json
 "message": "Already answered on Mon Feb 05 2024 18:02:50 GMT-0800 (Pacific Standard Time)"
```

### app.get('/api/get_my_survey_answer', get_my_survey_answers) 获得自己对某套题的答案 （需要session）

例：body
```json
{
  "survey_id": 1,
}
```
return：(每道原题 + 答案)
```json
[
    {
        "question": {
            "question_id": 1,
            "question_discription": "我在想到家庭的时候感到沮丧或愤怒",
            "question_type": "simple_choice",
            "Relation": {
                "qsr_id": 1,
                "question_id": 1,
                "survey_id": 1,
                "question_order": 1
            }
        },
        "answer": {
            "answer_id": 1,
            "qsr_id": 1,
            "user_id": 12345,
            "option_id": null,
            "value": "A",
            "createdAt": "2024-02-06T02:02:50.313Z",
            "updatedAt": "2024-02-06T02:02:50.313Z",
            "RelationQsrId": null
        }
    },
.
.
.
    {
        "question": {
            "question_id": 5,
            "question_discription": "我不像以前那样喜欢与人打交道了",
            "question_type": "simple_choice",
            "Relation": {
                "qsr_id": 5,
                "question_id": 5,
                "survey_id": 1,
                "question_order": 5
            }
        },
        "answer": {
            "answer_id": 5,
            "qsr_id": 5,
            "user_id": 12345,
            "option_id": null,
            "value": "F",
            "createdAt": "2024-02-06T02:02:50.313Z",
            "updatedAt": "2024-02-06T02:02:50.313Z",
            "RelationQsrId": null
        }
    }
]
```

## survey：

### app.get('/api/surveys/get_survey_by_id', get_survey_by_id) 获取某套原题，如果不提供survey_id, 则返回 survey_id == 1的 内置题（不需要session）

例：body
```json
{
  "survey_id": 1,
}
```
return：(每道原题)
```json
{
    "survey_id": 1,
    "questions": [
        {
            "question_id": 1,
            "question_discription": "我在想到家庭的时候感到沮丧或愤怒",
            "question_type": "simple_choice",
            "Relation": {
                "qsr_id": 1,
                "question_id": 1,
                "survey_id": 1,
                "question_order": 1
            }
        },
...
        {
            "question_id": 5,
            "question_discription": "我不像以前那样喜欢与人打交道了",
            "question_type": "simple_choice",
            "Relation": {
                "qsr_id": 5,
                "question_id": 5,
                "survey_id": 1,
                "question_order": 5
            }
        }
    ]
}
```

## TODO：
### get_user_character: 持续在前端和LLM中通信，直到后LLM返回“性格测试结果”，把测试结果储存进 user。 
### get_decorated_survey： 向LLM 提供某套题 + 用户“性格测试结果”， 把 LLM修饰后的问题发给前端。
