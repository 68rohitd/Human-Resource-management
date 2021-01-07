import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../../context";
import SidePanel from "../SidePanel";
import BonusRequestCard from "./BonusRequestCard";
import RequestCard from "./LeaveRequestCard";
import LoanRequestCard from "./LoanRequestCard";

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
            <>
              <div className="row m-0">
                {/* left part */}
                <div className="col-2 p-0 leftPart">
                  <SidePanel />
                </div>

                {/* right part */}
                <div className="col">
                  <div className="container">
                    <h1>Leave Requests</h1>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      {user ? (
                        user.leaveRequests.length ? (
                          user.leaveRequests.map((req, index) => {
                            return (
                              <RequestCard
                                key={index}
                                req={req}
                                onApprove={this.onApprove}
                                onReject={this.onReject}
                              />
                            );
                          })
                        ) : (
                          <small>No leave requests pending...</small>
                        )
                      ) : null}
                    </div>

                    <hr />

                    <h1>Bonus Requests</h1>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      {user ? (
                        user.bonusRequests.length ? (
                          user.bonusRequests.map((req, index) => {
                            return (
                              <BonusRequestCard
                                key={index}
                                req={req}
                                onApprove={this.onApprove}
                                onReject={this.onReject}
                              />
                            );
                          })
                        ) : (
                          <small>No bonus requests pending...</small>
                        )
                      ) : null}
                    </div>

                    <hr />

                    <h1>Loan Requests</h1>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      {user ? (
                        user.loanRequests.length ? (
                          user.loanRequests.map((req, index) => {
                            return (
                              <LoanRequestCard
                                key={index}
                                req={req}
                                onApprove={this.onApprove}
                                onReject={this.onReject}
                              />
                            );
                          })
                        ) : (
                          <small>No loan requests pending...</small>
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </Consumer>
    );
  }
}
