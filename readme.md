接口：

answers：

app.post('/api/add_my_survey_result', push_answers)

app.get('/api/get_my_survey_answer', get_my_survey_answers)

survey：

app.get('/api/surveys/get_survey_by_id', get_survey_by_id)

user：

app.post("/api/auth/sign_up", sign_up);

app.post("/api/auth/sign_in", sign_in);

TODO：
get_user_character
get_decorated_survey