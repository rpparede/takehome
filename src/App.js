import React from "react";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import Home from './components/Home'
import Quiz from './components/Quiz'
import PageNotFound from './components/PageNotFound'
//Import bootstrap for styling
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Exponent
          </Link>
        </nav>
        <div className="container mt-3">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route exact path="/quiz/:id" component={Quiz} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    </div >
  );
}
export default App;
