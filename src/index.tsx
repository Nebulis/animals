import React from "react";
import ReactDOM from "react-dom";
import { Home } from "./Home";
import { AddAnimal } from "./AddAnimal";
import "./styles/tailwind.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/add">
        <AddAnimal />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
