import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Consumer } from "../../context";

export default class Home extends Component {
  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");

          return (
            <div>
              <h1>this is home page</h1>

              {token && user && user.role === "admin" ? (
                <Link to="/statistics">
                  <button>admin dashboard</button>
                </Link>
              ) : null}

              {token && user && user.role !== "admin" ? (
                <Link to="/empDashboard">
                  <button>emp dashboard</button>
                </Link>
              ) : null}
            </div>
          );
        }}
      </Consumer>
    );
  }
}
