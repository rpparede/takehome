import axios from 'axios';

const API_URL = 'http://localhost:8080';

class QuizService {
  getQuizes() {
    return axios.get(API_URL + '/api/quizzes');
  }
  getQuiz(id) {
    return axios.get(API_URL + '/api/quizzes/' + id);
  }
  submitQuiz(id, data) {
    return axios.post(API_URL + '/api/quizzes/' + id + '/attempt', data);
  }
}

export default new QuizService();