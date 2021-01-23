import React, { Component } from "react";
import { useEffect, useState } from 'react';
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
  useEffect(() => {
    QuizService.getQuizes().then(res => {
      setQuizes(res.data);
      //TODO CATCH ERROR
    }).catch(err => {
      console.log("error")
      console.log(err)
    })
  }, []);
  return (
    <>
      {
        quizes.length && (
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
      } else {
        setErrorMessage(err.message)
        console.log("hiiiii")
      }
    })

  }, []);
  const handleSubmit = (event) => {
    event.preventDefault()
    console.log("sending data")
    /*const data = new FormData();
    data.append('answers', "test");*/

    const data = {
      "answers": quizAnswers
    }
    //console.log(data);
    QuizService.submitQuiz(quiz.id, data).then(res => {
      setQuizMarked(true);
      setQuizScore(parseInt(res.data.correct));
      setQuestionsMarked(res.data.questions);
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
    evt.preventDefault();
    //console.log("evt.target.value");
    //console.log(evt.target.value);
    const { name, value } = evt.target;
    setQuizAnswers({
      ...quizAnswers,
      [name]: value
    })

  }
  const tryAgainHandler = (event) => {
    event.preventDefault();
    setQuizAnswers({});
    setQuizMarked(false);
    setQuizScore(0);
    setQuestionsMarked({})
  }
  return (
    <>
      {errorMessage}
      {quizScore > 0 && <h1>Your score is {quizScore}</h1>}
      <Form onSubmit={handleSubmit}>
        <Form.Group >
          {
            Object.keys(quiz).length && (
              quiz.questions.map(question =>
                <div key={question.id}>
                  <p>{question.text}</p>
                  {quizMarked && <h1>{quizQuestionsMarked[question.id] && quizQuestionsMarked[question.id] ? "✔️" : "❌"}</h1>}
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
          {quizMarked ? <Button onClick={tryAgainHandler} type="submit">Try Again</Button> : <Button type="submit">Submit</Button>}
        </Form.Group>
      </Form>
    </>
  );
}
const Profile = () => <h1>Profile</h1>;

export default App;
