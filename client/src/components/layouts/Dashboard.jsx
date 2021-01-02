import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Consumer } from "../../context";

export default class Dashboard extends Component {
  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          if (user === undefined) user = "";
          // getting token from localstorage to avoid flicker
          let token = localStorage.getItem("auth-token");

          if (token) {
            if (user && user.role === "admin")
              return (
                <div className="container">
                  {/* add emp */}
                  <Link to="/add">
                    <button className="btn btn-primary">add emp</button>
                  </Link>

                  {/* view requests */}
                  <Link to="/viewRequests">
                    <button className="btn btn-primary">View requests</button>
                  </Link>

                  {/* view employees */}
                  <Link to="/viewEmployees">
                    <button className="btn btn-primary">View empl</button>
                  </Link>

                  {/* view employees */}
                  <Link to="/payroll">
                    <button className="btn btn-primary">
                      payroll dashboard
                    </button>
                  </Link>
                </div>
              );
            else return <Redirect to="/" />;
          } else {
            return <Redirect to="/login" />;
          }
        }}
      </Consumer>
    );
  }
}
