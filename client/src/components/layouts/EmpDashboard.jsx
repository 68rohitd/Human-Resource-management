import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Consumer } from "../../context";

export default class EmpDashboard extends Component {
  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;

          if (!user) return <Redirect to="/" />;

          return (
            <div className="container">
              <Link to="/attendence">
                <button className="btn btn-secondary">manage attendence</button>
              </Link>

              <Link to="/otherRequest">
                <button className="btn btn-secondary">other req</button>
              </Link>

              <Link to="/myRequests">
                <button className="btn btn-secondary">My requests</button>
              </Link>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
