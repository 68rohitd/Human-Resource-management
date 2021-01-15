import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Consumer } from "../../context";
import EmpSidePanel from "./Employee/EmpSidePanel";

export default class EmpDashboard extends Component {
  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");
          if (!token) return <Redirect to="/login" />;

          if (user && user.role === "admin") return <Redirect to="/" />;

          return (
            <div className="row m-0">
              {/* left part */}
              <div className="col-2 p-0 leftPart">
                <EmpSidePanel />
              </div>

              {/* right part */}

              <div className="col rightPart container "></div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
