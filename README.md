# 📝 Quiz App

Welcome to my version of this Quiz Application. I used the provided Node.js API and I implemented my front end in React. I used Axios to call server endpoints.
This application can scale as the number of questions in the quizzes.json file increases, so if any extra quizes are added the application will handle it.

If you have any questions please reach out to me at: rpparede@uwaterloo.ca

## Project Functionality
* Homepage: User can view a list of available quizzes and click on them
* Quiz page: User can view a quiz and see multiple choice questions
* Grading: User can submit the quiz and see their grade 
* Try again: User can retry the quiz in case they need to retake the test

## Demo
Here's a quick video of the application recorded on my machine:
https://youtu.be/L69NHgvyVz4

![Screen1](./screen1.jpg)
![Screen2](./screen2.jpg)
![Screen3](./screen3.jpg)

## Submission 

* Code available on the .zip file submited to Dropbox
* Code will be available in this repository after 3:00 PM EST: https://github.com/rpparede/takehome 

## Running the project 
Please note: Running npm start to run the client and server together did not work on my machine when I cloned the repo (probaly because I use windows). I edited this line from package.json
"start": "node src/server & react-scripts start; kill $!". You need to run the client and server on separate terminals as described below.


After downloading the repo, go to the directory open 2 terminals

Terminal 1: Start server 
```
npm install
```
go to src directory using 
```
cd src
```
```
node server.js
```
Terminal 2: Start react application on http://localhost:3000

On the project folder where you cloned the repo run 
```
npm start
```

## API Documentation

### **GET `/api/quizzes/:id`**
Returns a Quiz data object given a valid quiz ID

**Request**

| Key | Type | Description
| -- | -- | -- |
| `id` | `String` | A unique identifier for the quiz


**Response**

| Key | Type | Description
| -- | -- | -- |
| `id` | `String` | A unique identifier for the quiz
| `title` | `String` | The human-readable title of the quiz
| `questions` | `Array<Question>` | An array of multiple choice questions


**`Question` Format**
| Key | Type | Description
| -- | -- | -- |
| `id` | `String` | An id for the question, unique to this quiz, e.g. "question_1"
| `text` | `String` | The text content of the question
| `options` | `Array<String>` | A list of multiple choice options

Example response:
```json
{
  "id": "example",
  "title": "My Quiz",
  "questions": [{
    "id": "question_1",
    "text": "What is 1 + 1?",
    "options": ["1", "2", "3"]
  }, {
    "id": "question_2",
    "text": "True or false: 2 + 2 = 4",
    "options": ["True", "False"]
  }]
}
```

### **POST `/api/quizzes/:id/attempt`**

Handles submitting a quiz attempt and returns a graded result showing which questions were correct and incorrect.

**Request**
| Key | Type | Description
| -- | -- | -- |
| `answers` | `{[id: String]: String}` | An object mapping ID of each question to the user-provided value

**Response**
| Key | Type | Description
| -- | -- | -- |
| `correct` | `Number` | Number of correct answers
| `incorrect` | `Number` | Number of incorrect answers
| `questions` | `{[id: String]: Boolean}` | An object mapping ID of each question to the graded result, where `true` represents a correct answer.

```json
// POST /api/quizzes/1/attempt
{
  "answers": {
    "question_1": "2",
    "question_2": "False"
  }
}

// Response
{
  "correct": 1,
  "incorrect": 1,
  "questions": {
    "question_1": true,
    "question_2": false,
  }
}
```

Note: The API may return a 404 if the quiz does not exist or a 400 if incorrectly formatted.

