import React from "react";
import { useEffect, useState, useRef } from 'react';
import QuizService from "../services/quiz.service";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Constants from "../constants/messages"

const Quiz = (props) => {
  // Stores entire Quiz coming from the server on GET request
  const [quiz, setQuiz] = useState({});
  // Stores quiz checkbox answers to be submitted using POST to server to be marked
  const [quizAnswers, setQuizAnswers] = useState({});
  // Boolean used to set Quiz as marked or not
  const [quizMarked, setQuizMarked] = useState(false);
  // Stores quiz result text i.e "Your score is 33.33% (1/3 correct)"
  const [quizResults, setQuizResults] = useState('');
  // Stores marked quiz
  const [quizQuestionsMarked, setQuestionsMarked] = useState({});
  // Stores any error message caused by either server crash or incorrect quiz id
  const [errorMessage, setErrorMessage] = useState('');

  //Get quiz questions on page load
  useEffect(() => {
    // Obtain the quiz id from url, this enables users sharing a url to a specific quiz as well
    const { id } = props.match.params;
    QuizService.getQuiz(id).then(res => {
      setQuiz(res.data);
    }).catch(err => {
      if (err.response) {// Catch 404 errors for not existing quiz id
        setErrorMessage(err.message + Constants.invalidQuiz)
      } else { // Catch server related issues
        setErrorMessage(err.message + Constants.serverDown)
      }
    })
  }, []);
  // Function used to populate quiz results in this format i.e "Your score is 33.33% (1/3 correct)"
  const getQuizResults = (correctAnswers, incorrectAnswers) => {
    const correct = parseInt(correctAnswers);
    const incorrect = parseInt(incorrectAnswers);
    const total = correct + incorrect;
    let percentage = (correct / (correct + incorrect)) * 100
    if (incorrect !== 0) {
      percentage = Math.round(percentage * 100) / 100; //Math.round(num*100)/100 is used to limit decimal places to two decimal places
    }
    return `Your score is ${percentage}% (${correct}/${total} correct)`
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const data = {
      "answers": quizAnswers
    }
    QuizService.submitQuiz(quiz.id, data).then(res => {
      setQuizMarked(true);
      setQuizResults(getQuizResults(res.data.correct, res.data.incorrect));
      setQuestionsMarked(res.data);
    }).catch(err => {
      if (err.response) { // Catch 400 errors for incorrectly formatting
        setErrorMessage(err.message + Constants.invalidFormatting)
      } else { // Catch any other server issues
        setErrorMessage(err.message + Constants.serverDown)
      }
    })
  }
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setQuizAnswers({
      ...quizAnswers,
      [name]: value
    })
  }
  const tryAgainHandler = (event) => {
    // This part could be improved since we already have the quiz data, redux could be used instead but that is out of the scope
    window.location.reload(false);
  }
  return (
    <div className="col-md-12">
      {errorMessage !== '' ? (<h3 className="error">{errorMessage}</h3>) : (
        <>
          <div className="text-center">
            <h2>{quiz.title}</h2>
            {quizResults && <h3>{quizResults}</h3>}
          </div>
          {/*Style property on form is used to only show the form once the data has been fetched and avoid flickering coming from home page*/}
          <Form onSubmit={handleSubmit} style={{ display: Object.keys(quiz).length > 0 ? "block" : "none" }}>
            {
              Object.keys(quiz).length > 0 && (
                quiz.questions.map((question, index) =>
                  <div key={index}>
                    <div className="row">
                      <div style={{ fontWeight: "bold" }}>{index + 1}) {question.text}</div>
                      {Object.keys(quizQuestionsMarked).length > 0 && (<div>{Object.keys(quizQuestionsMarked.questions).length && quizQuestionsMarked.questions[question.id] ? <div style={{ color: "#006400", fontWeight: "bold" }}>✔️ Correct</div> : <div style={{ color: "#FF0000", fontWeight: "bold" }}>❌ Incorrect</div>}</div>)}
                    </div>
                    {
                      question.options.map((option, index) =>
                        <Form.Check
                          required
                          key={index}
                          type="radio"
                          label={option}
                          value={option}
                          name={question.id}
                          id={question.id}
                          onChange={(e) => handleChange(e)}
                          disabled={quizMarked}
                        />
                      )
                    }
                    <hr></hr>
                  </div>
                )
              )
            }
            <div className="text-center">
              {quizMarked ? <Button onClick={tryAgainHandler} >Try Again</Button> : <Button type="submit">Submit</Button>}
            </div>
          </Form>
        </>
      )}
    </div>
  );
}
export default Quiz;