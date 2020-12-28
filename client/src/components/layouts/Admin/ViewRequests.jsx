import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../context";

export default class ViewRequests extends Component {
  componentDidMount = async () => {};

  onApprove = async (req) => {
    console.log("approving: ", req);
    req.approved = true;
    req.ticketClosed = true;
    const res = await axios.put("/api/admin/takeAction", { userReq: req });
    console.log(res.data);
  };

  onReject = async (req) => {
    console.log("rejecting: ", req);
    req.approved = false;
    req.ticketClosed = true;
    const res = await axios.put("/api/admin/takeAction", { userReq: req });
    console.log(res.data);
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user } = value;
          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/" />;
          return (
            <div className="container">
              <h1>Leave requests</h1>
              {user &&
                user.leaveRequests.map((req, index) => {
                  return (
                    <div key={index} className="container mb-3">
                      <p>EMP name: {req.empName}</p>
                      <p>reason: {req.reason}</p>
                      <p>From: {req.fromDate}</p>
                      <p>To: {req.toDate}</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => this.onApprove(req)}
                      >
                        approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => this.onReject(req)}
                      >
                        reject
                      </button>
                    </div>
                  );
                })}
              <hr />
              <h1>Bonus requests</h1>
              <hr />
              <h1>Loan requests</h1>
              <hr />
            </div>
          );
        }}
      </Consumer>
    );
  }
}
