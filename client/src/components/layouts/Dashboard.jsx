import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Consumer } from "../../context";
import SidePanel from "./Admin/SidePanel";

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
                <>
                  <div className="row">
                    {/* left part */}
                    <div className="col-3">
                      <SidePanel />
                    </div>

                    {/* right part */}
                    <div className="col">
                      <div className="container">
                        {/* add emp */}
                        <Link to="/add">
                          <button className="btn btn-primary">add emp</button>
                        </Link>

                        {/* view requests */}
                        <Link to="/viewRequests">
                          <button className="btn btn-primary">
                            View requests
                          </button>
                        </Link>

                        {/* view employees */}
                        <Link to="/viewEmployees">
                          <button className="btn btn-primary">View empl</button>
                        </Link>

                        {/* payroll */}
                        <Link to="/payroll">
                          <button className="btn btn-primary">
                            payroll dashboard
                          </button>
                        </Link>

                        {/* stats */}
                        <Link to="/statistics">
                          <button className="btn btn-primary">stats</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
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
