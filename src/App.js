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
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/about"} className="nav-link">
                Home
              </Link>
            </li>
          </div>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" exact component={About} />
          <Route exact path="/quiz/:id" exact component={Quiz} />
          <Route path="/profile" exact component={Profile} />
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
    });


  }, []);
  return (
    <>
      {
        quizes.length && (
          quizes.map(quiz =>
            <Link key={quiz.id} to={{ pathname: `/quiz/${quiz.id}`, id: quiz.id }}>
              <h1>{quiz.title}</h1>
            </Link>
          )
        )
      }
    </>
  );
}
const About = () => <h1>About</h1>;
const Quiz = (props) => {
  const [quizId, setQuizId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizMarked, setQuizMarked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestionsMarked, setQuestionsMarked] = useState({});
  useEffect(() => {
    QuizService.getQuiz(props.location.id).then(res => {
      //console.log("Res");
      setQuizId(res.data.id)
      setQuizTitle(res.data.title)
      setQuizQuestions(res.data.questions)
      console.log(res);
    });

  }, []);
  const handleSubmit = (event) => {

    event.preventDefault()
    console.log("sending data")
    /*const data = new FormData();
    data.append('answers', "test");*/

    const data = {
      "answers": quizAnswers
    }
    console.log(data);
    QuizService.submitQuiz(quizId, data).then(res => {
      setQuizMarked(true);
      setQuizScore(parseInt(res.data.correct));
      setQuestionsMarked(res.data.questions);
      console.log(res);
    });
  }
  const handleChange = (evt) => {
    evt.preventDefault();
    console.log("evt.target.value");
    console.log(evt.target.value);
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
      {console.log(quizQuestionsMarked)}
      {quizScore > 0 && <h1>Your score is {quizScore}</h1>}
      <Form onSubmit={handleSubmit}>
        <Form.Group >
          {
            quizQuestions.length && (
              quizQuestions.map(question =>
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
