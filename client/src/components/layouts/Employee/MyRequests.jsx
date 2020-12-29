import axios from "axios";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Consumer } from "../../../context";

export default class MyRequests extends Component {
  constructor() {
    super();

    this.state = {
      user: {},
      openedLeavesTickets: [],
      closedLeavesTickets: [],

      openedLoanTickets: [],
      closedLoanTickets: [],

      openedBonusTickets: [],
      closedBonusTickets: [],
    };
  }

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
      () => this.filterLists()
    );
  };

  filterLists = () => {
    let openedLeavesTickets = [];
    let closedLeavesTickets = [];

    let openedLoanTickets = [];
    let closedLoanTickets = [];

    let openedBonusTickets = [];
    let closedBonusTickets = [];

    this.state.user.notification.forEach((item) => {
      if (item.title === "leave request") {
        if (item.ticketClosed) closedLeavesTickets.push(item);
        else openedLeavesTickets.push(item);
      } else if (item.title === "loan request") {
        if (item.ticketClosed) closedLoanTickets.push(item);
        else openedLoanTickets.push(item);
      } else {
        if (item.ticketClosed) closedBonusTickets.push(item);
        else openedBonusTickets.push(item);
      }
    });
    this.setState({
      openedLeavesTickets,
      closedLeavesTickets,
      openedBonusTickets,
      closedBonusTickets,
      openedLoanTickets,
      closedLoanTickets,
    });
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
              <div>
                <h1>Leave requests</h1>
                <h3>open tickets</h3>
                {this.state.openedLeavesTickets.map((req, index) => {
                  return (
                    <div key={index} className="card">
                      <span>Name: {req.empName}</span>
                      <span>Reason: {req.reason}</span>
                      <span>
                        {req.ticketClosed ? (
                          req.approved ? (
                            <span>status: approved</span>
                          ) : (
                            <span>status: rejected</span>
                          )
                        ) : (
                          <span>status: pending</span>
                        )}
                      </span>
                    </div>
                  );
                })}
                <h3>closed tickets</h3>
                {this.state.closedLeavesTickets.map((req, index) => {
                  return (
                    <div key={index} className="card">
                      <span>Name: {req.empName}</span>
                      <span>Reason: {req.reason}</span>
                      <span>
                        {req.ticketClosed ? (
                          req.approved ? (
                            <span>status: approved</span>
                          ) : (
                            <span>status: rejected</span>
                          )
                        ) : (
                          <span>status: pending</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              <hr />

              <div>
                <h1>Bonus requests</h1>
                <h3>open tickets</h3>
                {this.state.openedBonusTickets.map((req, index) => {
                  return (
                    <div key={index} className="card">
                      <span>Name: {req.empName}</span>
                      <span>Note: {req.bonusNote}</span>
                      <span>
                        {req.ticketClosed ? (
                          req.approved ? (
                            <span>status: approved</span>
                          ) : (
                            <span>status: rejected</span>
                          )
                        ) : (
                          <span>status: pending</span>
                        )}
                      </span>
                    </div>
                  );
                })}
                <h3>closed tickets</h3>
                {this.state.closedBonusTickets.map((req, index) => {
                  return (
                    <div key={index} className="card">
                      <span>Name: {req.empName}</span>
                      <span>Note: {req.bonusNote}</span>
                      <span>
                        {req.ticketClosed ? (
                          req.approved ? (
                            <span>status: approved</span>
                          ) : (
                            <span>status: rejected</span>
                          )
                        ) : (
                          <span>status: pending</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              <hr />
              <div>
                <h1>Loan requests</h1>
                <h3>open tickets</h3>
                {this.state.openedLoanTickets.map((req, index) => {
                  return (
                    <div key={index} className="card">
                      <span>Name: {req.empName}</span>
                      <span>Note: {req.loanNote}</span>
                      <span>
                        {req.ticketClosed ? (
                          req.approved ? (
                            <span>status: approved</span>
                          ) : (
                            <span>status: rejected</span>
                          )
                        ) : (
                          <span>status: pending</span>
                        )}
                      </span>
                    </div>
                  );
                })}
                <h3>closed tickets</h3>
                {this.state.closedLoanTickets.map((req, index) => {
                  return (
                    <div key={index} className="card">
                      <span>Name: {req.empName}</span>
                      <span>Note: {req.loanNote}</span>
                      <span>
                        {req.ticketClosed ? (
                          req.approved ? (
                            <span>status: approved</span>
                          ) : (
                            <span>status: rejected</span>
                          )
                        ) : (
                          <span>status: pending</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }}
      </Consumer>
    );
  }
}
