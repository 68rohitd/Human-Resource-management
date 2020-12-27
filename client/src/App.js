import React, { Component } from "react";
import { Provider } from "./context";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ContactUs from "./components/layouts/ContactUs";
import PageNotFound from "./components/layouts/PageNotFound";
import About from "./components/layouts/About";

import "./App.css";
import Header from "./components/layouts/Header";
import AddEmployee from "./components/layouts/AddEmployee";
import Dashboard from "./components/layouts/Dashboard";
import Profile from "./components/layouts/Profile";
import EmpDashboard from "./components/layouts/EmpDashboard";
import Attendence from "./components/layouts/Employee/Attendence";
export default class App extends Component {
  render() {
    return (
      <Provider>
        <Router>
          <div>
            <Header branding="HR" />
            <Switch>
              <Route exact path="/adminDashboard" component={Dashboard} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/add" component={AddEmployee} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/contactus" component={ContactUs} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/attendence" component={Attendence} />
              <Route exact path="/empDashboard" component={EmpDashboard} />
              <Route exact path="/about" component={About} />
              <Route component={PageNotFound} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
