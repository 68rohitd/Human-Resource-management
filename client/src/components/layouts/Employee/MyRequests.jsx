import axios from "axios";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Consumer } from "../../../context";
import EmpSidePanel from "./EmpSidePanel";

export default class MyRequests extends Component {
  constructor() {
    super();

    this.state = {
      user: {},
      leaveRequests: [],
      openedLeavesTickets: [],
      closedLeavesTickets: [],

      loanRequests: [],
      openedLoanTickets: [],
      closedLoanTickets: [],

      bonusRequests: [],
      openedBonusTickets: [],
      closedBonusTickets: [],

      // choose
      selectedLabel: "Leave Requests",
    };
  }

  onGetDate = (date) => {
    const d = new Date(date);
    let returnDate = d.toLocaleDateString("en-GB");
    return returnDate;
  };

  componentDidMount = async () => {
    const token = localStorage.getItem("auth-token");
    const userRes = await axios.get("/api/users", {
      headers: { "x-auth-token": token },
    });

    console.log(userRes.data.user);

    this.setState(
      {
        user: userRes.data.user,
      },
      () => {
        this.filterLists();
      }
    );
  };

  filterLists = () => {
    let leaveRequests = [];
    let openedLeavesTickets = [];
    let closedLeavesTickets = [];

    let loanRequests = [];
    let openedLoanTickets = [];
    let closedLoanTickets = [];

    let bonusRequests = [];
    let openedBonusTickets = [];
    let closedBonusTickets = [];

    this.state.user.notification.forEach((item) => {
      if (item.title === "leave request") {
        leaveRequests.push(item);
        if (item.ticketClosed) closedLeavesTickets.push(item);
        else openedLeavesTickets.push(item);
      } else if (item.title === "loan request") {
        loanRequests.push(item);
        if (item.ticketClosed) closedLoanTickets.push(item);
        else openedLoanTickets.push(item);
      } else {
        bonusRequests.push(item);
        if (item.ticketClosed) closedBonusTickets.push(item);
        else openedBonusTickets.push(item);
      }
    });
    this.setState({
      leaveRequests,
      loanRequests,
      bonusRequests,
      openedLeavesTickets,
      closedLeavesTickets,
      openedBonusTickets,
      closedBonusTickets,
      openedLoanTickets,
      closedLoanTickets,
    });
  };

  onSelectLabel = (selectedLabel) => {
    this.setState({
      selectedLabel,
    });
  };

  render() {
    return (
      <Consumer>
        {(value) => {
          const token = localStorage.getItem("auth-token");

          if (!token) return <Redirect to="/" />;
          return (
            <div className="row m-0">
              {/* left part */}
              <div className="col-2 p-0 leftPart">
                <EmpSidePanel />
              </div>

              {/* right part */}
              <div className="col rightPart">
                <div className="container pl-5 pt-3">
                  <div className="row">
                    <div className="col">
                      <h1>My Requests</h1>
                    </div>

                    <div className="col">
                      {/* choose buttons */}
                      <div
                        className="btn-group btn-group-toggle"
                        data-toggle="buttons"
                      >
                        <label className="btn btn-secondary active">
                          <input
                            type="radio"
                            name="options"
                            id="option1"
                            defaultChecked={true}
                            onClick={() => this.onSelectLabel("Leave Requests")}
                          />
                          Leave Requests
                        </label>
                        <label className="btn btn-secondary">
                          <input
                            type="radio"
                            name="options"
                            id="option2"
                            onClick={() => this.onSelectLabel("Bonus Requests")}
                          />
                          Bonus Requests
                        </label>
                        <label className="btn btn-secondary">
                          <input
                            type="radio"
                            name="options"
                            id="option3"
                            onClick={() => this.onSelectLabel("Loan Requests")}
                          />
                          Loan Requests
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />

                  {/* leave request */}
                  {this.state.selectedLabel === "Leave Requests" ? (
                    <div className="row p-0">
                      <div className="col">
                        <h3>Leave Requests</h3>

                        {this.state.leaveRequests.length ? (
                          <table className="table table-hover ">
                            <thead className="thead-light">
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Created On</th>
                                <th scope="col">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.leaveRequests.map((req, index) => {
                                return (
                                  <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                      <Link
                                        style={{ textDecoration: "none" }}
                                        to={`/viewSingleRequest/${req.title}/${req.reqId}`}
                                      >
                                        {req.subject}
                                      </Link>
                                    </td>
                                    <td>{this.onGetDate(req.date)}</td>
                                    {req.ticketClosed ? (
                                      <td>Closed</td>
                                    ) : (
                                      <td>Pending</td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <small>No tickets</small>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* bonus request */}
                  {this.state.selectedLabel === "Bonus Requests" ? (
                    <div className="row">
                      <div className="col">
                        <h3>Bonus Requests</h3>

                        {this.state.bonusRequests.length ? (
                          <table className="table table-hover">
                            <thead className="thead-light">
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Created On</th>
                                <th scope="col">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.bonusRequests.map((req, index) => {
                                return (
                                  <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                      <Link
                                        style={{ textDecoration: "none" }}
                                        to={`/viewSingleRequest/${req.title}/${req.reqId}`}
                                      >
                                        {req.bonusReason}
                                      </Link>
                                    </td>
                                    <td>{this.onGetDate(req.date)}</td>
                                    {req.ticketClosed ? (
                                      <td>Closed</td>
                                    ) : (
                                      <td>Pending</td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <small>No tickets</small>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Loan requests */}
                  {this.state.selectedLabel === "Loan Requests" ? (
                    <div className="row">
                      <div className="col">
                        <h3>Loan Requests</h3>

                        {this.state.loanRequests.length ? (
                          <table className="table table-hover">
                            <thead className="thead-light">
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Subject</th>
                                <th scope="col">Created On</th>
                                <th scope="col">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.loanRequests.map((req, index) => {
                                return (
                                  <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                      <Link
                                        style={{ textDecoration: "none" }}
                                        to={`/viewSingleRequest/${req.title}/${req.reqId}`}
                                      >
                                        {req.loanReason}
                                      </Link>
                                    </td>
                                    <td>{this.onGetDate(req.date)}</td>
                                    {req.ticketClosed ? (
                                      <td>Closed</td>
                                    ) : (
                                      <td>Pending</td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <small>No tickets</small>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
