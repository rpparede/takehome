import React, { Component } from "react";
import { useEffect, useState } from 'react';
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import QuizService from "./services/quiz.service";
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
  console.log("**")
  console.log(props.location.id)
  const [quizDetails, setQuizesDetails] = useState([]);
  useEffect(() => {
    QuizService.getQuiz(props.location.id).then(res => {
      console.log("Res");
      console.log(res);
    });


  }, []);
  return (
    <>
      <h1>Updates</h1>
    </>
  );
}
const Profile = () => <h1>Profile</h1>;

export default App;
