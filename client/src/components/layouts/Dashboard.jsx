import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Consumer } from "../../context";

export default class Dashboard extends Component {
  render() {
    return (
      <Consumer>
        {(value) => {
          let { user, dispatch } = value;
          if (user === undefined) user = "";
          // getting token from localstorage to avoid flicker
          let token = localStorage.getItem("auth-token");

          if (token) {
            if (user && user.role === "admin")
              return (
                <div className="container">
                  <Link to="/add">
                    <button className="btn btn-primary">add emp</button>
                  </Link>
                </div>
              );
            else return <Redirect to="/empDashboard" />;
          } else {
            return <Redirect to="/login" />;
          }
        }}
      </Consumer>
    );
  }
}
