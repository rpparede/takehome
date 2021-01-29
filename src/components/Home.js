import React from "react";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import QuizService from "../services/quiz.service";
import Constants from "../constants/messages"
import ListGroup from 'react-bootstrap/ListGroup'

const Home = () => {
  const [quizes, setQuizes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    QuizService.getQuizes().then(res => {
      setQuizes(res.data);
      //Remove any previous error message, if server crased and app reloads
      setErrorMessage('');
    }).catch(err => {
      //Case when server is down, display message to user
      setErrorMessage(err.message + Constants.serverDown)
    })
  }, []);
  return (
    <div className="col-md-12">
      {errorMessage !== '' ? (<h3 className="error">{errorMessage}</h3>) :
        (
          <div style={{ display: Object.keys(quizes).length > 0 ? "block" : "none" }}>
            <div className="text-center">
              <h2>{Constants.homePageTitle}</h2>
              <h3>{Constants.homePageSubtitle}</h3>
            </div>

            <ListGroup>
              {
                quizes.length > 0 && (
                  quizes.map((quiz, index) =>
                    <ListGroup.Item key={index} className="text-center">
                      <Link style={{ textDecoration: 'none' }} key={quiz.id} to={{ pathname: `/quiz/${quiz.id}` }}>
                        <h3>{quiz.title}</h3>
                      </Link>
                    </ListGroup.Item>
                  )
                )
              }
            </ListGroup>
          </div>
        )}
    </div>
  );
}
export default Home;