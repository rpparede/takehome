import React, { Component } from "react";
import { useEffect, useState, useRef } from 'react';
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import QuizService from "./services/quiz.service";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
//Impost bootstrap for styling
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Exponent
          </Link>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route exact path="/quiz/:id" exact component={Quiz} />
          <Route component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

const Home = () => {
  const [quizes, setQuizes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    QuizService.getQuizes().then(res => {
      setQuizes(res.data);
      //Remove any previous error message
      setErrorMessage('');
    }).catch(err => {
      //Case when server is down, display message to user
      if (err.request) {
        setErrorMessage(err.message + ": Please try again in a moment. \n If the error persists please reach out to support@adminsupport.com")
      } else {
        setErrorMessage(err.message)
      }
    })
  }, []);
  return (
    <>
      {errorMessage && <h5>{errorMessage}</h5>}
      {
        quizes.length > 0 && (
          quizes.map(quiz =>
            <Link key={quiz.id} to={{ pathname: `/quiz/${quiz.id}` }}>
              <h1>{quiz.title}</h1>
            </Link>
          )
        )
      }
    </>
  );
}
const PageNotFound = () => {
  return (
    <div>
      <h1>Page Not Found</h1>
      <p>Sorry, there is nothing to see here.</p>
      <p><Link to="/">Back to Home</Link></p>
    </div>
  );
}
const Quiz = (props) => {
  const [quiz, setQuiz] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizMarked, setQuizMarked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestionsMarked, setQuestionsMarked] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef(null);
  //use single hook for quiz 
  useEffect(() => {

    //TODO: ADD COMMENTS 
    // Obtain the quiz id from url, this enables users sharing a url to a specific quiz as well
    const { id } = props.match.params
    QuizService.getQuiz(id).then(res => {
      console.log(res);
      setQuiz(res.data);

      //TODO:catch if error happens
    }).catch(err => {
      if (err.response) {
        setErrorMessage(err.message)
        // Catch 404 errors for quiz id not existing
      } else if (err.request) {
        console.log("err request")
        // client never received a response, or request never left
      }
      else {
        setErrorMessage(err.message)
        console.log("err else")
      }
    })

  }, []);
  const handleSubmit = (event) => {
    event.preventDefault()
    console.log("sending data")
    console.log(event)
    /*const data = new FormData();
    data.append('answers', "test");*/

    const data = {
      "answers": quizAnswers
    }
    //console.log(data);
    QuizService.submitQuiz(quiz.id, data).then(res => {
      setQuizMarked(true);
      console.log("calling submit")
      console.log(res.data)
      //setQuizScore(parseInt(res.data.correct));
      setQuestionsMarked(res.data);
      console.log(res);
    }).catch(err => {
      console.log("error send")
      console.log(err)
      if (err.response) {
        // Catch 400 errors for incorrectly formatting
      }
    })
  }
  const handleChange = (evt) => {
    //evt.preventDefault();
    console.log("evt.target.value");
    //console.log(evt.target.value);
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
    <>
      {errorMessage}

      {quizScore > 0 && <h1>Your score is {quizScore}</h1>}
      {  <Form ref={formRef} onSubmit={handleSubmit} style={{ display: Object.keys(quiz).length > 0 && errorMessage == '' ? "block" : "none" }}>

        {
          Object.keys(quiz).length > 0 && (
            quiz.questions.map(question =>
              <div key={question.id}>
                <p>{question.text}</p>
                {Object.keys(quizQuestionsMarked).length > 0 && (<h1>{Object.keys(quizQuestionsMarked.questions).length && quizQuestionsMarked.questions[question.id] ? "✔️" : "❌"}</h1>)}
                {
                  question.options.map(option =>
                    <Form.Check
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
              </div>
            )
          )
        }
        {quizMarked ? <Button onClick={tryAgainHandler} >Try Again</Button> : <Button type="submit">Submit</Button>}

      </Form>}
    </>
  );
}
const Profile = () => <h1>Profile</h1>;

export default App;
